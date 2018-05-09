import { from, Observable, of, Subscriber } from 'rxjs'
import { concatMap, map, shareReplay, subscribeOn } from 'rxjs/operators'
import { MoneyAccount, MoneyAccountID, NewMoneyAccount } from '~/types'
import { Log } from '~/utils/log'
import { Firestore } from './db'
import { createSnapshotObservable, getID, querySnapshotToDocumentArray } from './utils'

const moneyAccounts = 'moneyAccounts'
const log = Log('Database.MoneyCategories')

const resolve = (dbPromise) => (v) => from(dbPromise).pipe(concatMap(v))

export class MoneyAccounts {
  all = from(this.dbPromise).pipe(
    concatMap((db) =>
      createSnapshotObservable(db.collection(moneyAccounts))
        .pipe(map((querySnapshot) => querySnapshotToDocumentArray<MoneyAccount>(querySnapshot)))
        .pipe(shareReplay()),
    ),
  )
  constructor(private dbPromise: Promise<Firestore>) {}

  add = async (newMoneyAccount: NewMoneyAccount) => {
    const moneyAccount: MoneyAccount = {
      balance: newMoneyAccount.startingBalance,
      created: Date.now(),
      id: getID(),
      ...newMoneyAccount,
    }

    const db = await this.dbPromise

    await db
      .collection(moneyAccounts)
      .doc(moneyAccount.id)
      .set(moneyAccount)

    return moneyAccount
  }

  remove = async (moneyAccountID: MoneyAccountID) => {
    const db = await this.dbPromise
    await db
      .collection(moneyAccounts)
      .doc(moneyAccountID)
      .delete()
    return true
  }
}
