import * as firebase from 'firebase/app'
import { combineLatest, forkJoin, from, Observable } from 'rxjs'
import { concatMap, find, first, map, reduce, tap } from 'rxjs/operators'

import { createSnapshotObservable, getID, querySnapshotToDocumentArray } from '~/db/utils'
import { CreatedTransaction, NewTransaction, TransactionID, TransactionType } from '~/types'
import { Log } from '~/utils/log'
import { Database, Firestore } from './db'

const log = Log('db.transactions')

const TRANSACTIONS = 'transactions'

// const transactionsApi = {
//   all: (db: Firestore) =>
//     createSnapshotObservable(db.collection(transactions).orderBy('created', 'desc')).pipe(
//       map((querySnapshot) => {
//         return querySnapshotToDocumentArray<CreatedTransaction>(querySnapshot)
//       }),
//     ),
// }

export class Transactions {
  all = from(this.dbPromise).pipe(
    concatMap((db) =>
      createSnapshotObservable(db.collection(TRANSACTIONS).orderBy('created', 'desc')).pipe(
        map((querySnapshot) => {
          return querySnapshotToDocumentArray<CreatedTransaction>(querySnapshot)
        }),
      ),
    ),
  )
  constructor(private dbPromise: Promise<Firestore>) {}

  async add(newTransaction: NewTransaction): Promise<CreatedTransaction> {
    log('add %o', newTransaction)

    const id = getID()
    const transaction: CreatedTransaction = {
      ...newTransaction,
      created: Date.now(),
      id,
    }

    const toAndFrom = Database.instance.moneyAccounts.all.pipe(
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

    forkJoin(Database.instance.firestore$, toAndFrom)
      .pipe(
        tap((...args) => log('forkJoin stuff', args)),
        concatMap(([db, { toAccount, fromAccount }]) => {
          const batch = db.batch()
          // create the transaction
          batch.set(db.collection(TRANSACTIONS).doc(id), transaction)

          if (toAccount) {
            log('increate the balance of toAccount %o by %d', toAccount, transaction.value)
            // increase the balance of toAccount
            batch.update(db.collection('moneyAccounts').doc(toAccount.id), {
              balance: toAccount.balance + transaction.value,
              updated: Date.now(),
            })
          }
          if (fromAccount) {
            // reduce the balance of fromAccount
            batch.update(db.collection('moneyAccounts').doc(fromAccount.id), {
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
    const db = await this.dbPromise
    log('remove', txid)
    await db
      .collection('transactions')
      .doc(txid)
      .delete()

    return true
  }
}
