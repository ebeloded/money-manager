import { from, Observable, of, Subscriber } from 'rxjs'
import { concatMap, map, pluck, shareReplay, subscribeOn, tap } from 'rxjs/operators'
import { ConstructorProps, Database } from '~/db/db'
import { FirestoreFacade } from '~/db/FirestoreFacade'
import { Account, AccountID, CreateAccount } from '~/types'
import { Log } from '~/utils/log'

const log = Log('Database.MoneyCategories')

export class MoneyAccounts {
  all = this.init.firestore.pipe(
    concatMap((firestore) =>
      firestore
        .createSnapshotObservable(firestore.accounts)
        .pipe(map((querySnapshot) => firestore.querySnapshotToDocumentArray<Account>(querySnapshot)))
        .pipe(shareReplay()),
    ),
  )

  constructor(private init: ConstructorProps) {}

  add = async (newMoneyAccount: CreateAccount) => {
    const moneyAccount: Account = {
      balance: newMoneyAccount.startingBalance,
      created: Date.now(),
      id: Database.generateID(),
      ...newMoneyAccount,
    }

    this.init.firestore
      .pipe(
        concatMap((firestore) => {
          return firestore.accounts.doc(moneyAccount.id).set(moneyAccount)
        }),
      )
      .subscribe({
        complete: () => log('complete add money account'),
        next: (v) => log('next add money account', v),
      })

    return moneyAccount
  }

  remove = async (moneyAccountID: AccountID) => {
    this.init.firestore
      .pipe(
        concatMap((firestore) => {
          return firestore.accounts.doc(moneyAccountID).delete()
        }),
      )
      .subscribe({
        complete: () => log('complete add money account'),
        error: (err) => log('error', err),
        next: (v) => log('next add money account', v),
      })

    return true
  }
}
