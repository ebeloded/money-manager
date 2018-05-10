import { from, Observable, of, Subscriber } from 'rxjs'
import { concatMap, map, pluck, shareReplay, subscribeOn, tap } from 'rxjs/operators'
import { FirestoreFacade } from '~/db/FirestoreFacade'
import { MoneyAccount, MoneyAccountID, NewMoneyAccount } from '~/types'
import { Log } from '~/utils/log'
import { ConstructorProps, Database } from './db'

const log = Log('Database.MoneyCategories')

export class MoneyAccounts {
  all = this.init.firestore.pipe(
    concatMap((firestore) =>
      firestore
        .createSnapshotObservable(firestore.moneyAccounts)
        .pipe(map((querySnapshot) => firestore.querySnapshotToDocumentArray<MoneyAccount>(querySnapshot)))
        .pipe(shareReplay()),
    ),
  )

  constructor(private init: ConstructorProps) {}

  add = async (newMoneyAccount: NewMoneyAccount) => {
    const moneyAccount: MoneyAccount = {
      balance: newMoneyAccount.startingBalance,
      created: Date.now(),
      id: Database.generateID(),
      ...newMoneyAccount,
    }

    this.init.firestore
      .pipe(
        concatMap((firestore) => {
          return firestore.moneyAccounts.doc(moneyAccount.id).set(moneyAccount)
        }),
      )
      .subscribe({
        complete: () => log('complete add money account'),
        next: (v) => log('next add money account', v),
      })

    return moneyAccount
  }

  remove = async (moneyAccountID: MoneyAccountID) => {
    this.init.firestore
      .pipe(
        concatMap((firestore) => {
          return firestore.moneyAccounts.doc(moneyAccountID).delete()
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
