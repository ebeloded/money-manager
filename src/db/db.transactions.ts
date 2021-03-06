import { forkJoin, from } from 'rxjs'
import { concatMap, first, map } from 'rxjs/operators'
import { NewTransaction, Transaction, TransactionID, TransactionType } from '~/types'
import { Log } from '~/utils/log'
import { ConstructorProps, Database } from './db'

const log = Log('db.transactions')

export class Transactions {
  all = this.init.firestore.pipe(
    concatMap((firestore) =>
      firestore.createSnapshotObservable(firestore.transactions.orderBy('created', 'desc')).pipe(
        map((querySnapshot) => {
          return firestore.querySnapshotToDocumentArray<Transaction>(querySnapshot)
        }),
      ),
    ),
  )
  constructor(private init: ConstructorProps) {}

  async add(newTransaction: NewTransaction): Promise<Transaction> {
    log('add %o', newTransaction)

    const id = Database.generateID()
    const transaction: Transaction = {
      ...newTransaction,
      created: Date.now(),
      id,
    }

    forkJoin(this.init.firestore, getToAndFrom(this.init.db, transaction))
      .pipe(
        concatMap(([firestore, { toAccount, fromAccount }]) => {
          const batch = firestore.batch()
          // create the transaction
          batch.set(firestore.transactions.doc(id), transaction)

          if (toAccount) {
            log('increate the balance of toAccount %o by %d', toAccount, transaction.value)
            // increase the balance of toAccount
            batch.update(firestore.accounts.doc(toAccount.id), {
              balance: toAccount.balance + transaction.value,
              updated: Date.now(),
            })
          }
          if (fromAccount) {
            // reduce the balance of fromAccount
            batch.update(firestore.accounts.doc(fromAccount.id), {
              balance: fromAccount.balance - transaction.value,
              updated: Date.now(),
            })
          }
          return from(batch.commit())
        }),
      )
      .subscribe((v) => log('batch update result', v))

    return Promise.resolve(transaction)
  }

  async remove(txid: TransactionID) {
    log('remove', txid)

    this.init.firestore.pipe(concatMap((firestore) => firestore.transactions.doc(txid).delete())).subscribe({
      complete: () => log('complete remove transaction'),
      error: (err) => log('error', err),
      next: (v) => log('next remove transaction', v),
    })

    return true
  }
}

function getToAndFrom(db: Database, transaction: Transaction) {
  return db.accounts.all.pipe(
    first(),
    map((accounts) => {
      switch (transaction.transactionType) {
        case TransactionType.EXPENSE:
          return { fromAccount: accounts.find((a) => a.id === transaction.fromAccountID) }
        case TransactionType.INCOME:
          return { toAccount: accounts.find((a) => a.id === transaction.toAccountID) }
        case TransactionType.TRANSFER:
          return {
            fromAccount: accounts.find((a) => a.id === transaction.fromAccountID),
            toAccount: accounts.find((a) => a.id === transaction.toAccountID),
          }
      }
    }),
  )
}
