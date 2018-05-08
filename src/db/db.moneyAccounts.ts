import { from, Observable, of, Subscriber } from 'rxjs'
import { concatMap, map, shareReplay, subscribeOn } from 'rxjs/operators'
import { Firestore } from '~/db/API'
import { MoneyAccount, MoneyAccountID, NewMoneyAccount } from '~/types'
import { Log } from '~/utils/log'
import { createSnapshotObservable, getID, querySnapshotToDocumentArray } from './dbutils'

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

  alternativeAdd = (newMoneyAccount: NewMoneyAccount) => {
    log('alternative add', newMoneyAccount)
    const moneyAccount: MoneyAccount = {
      balance: newMoneyAccount.startingBalance,
      created: Date.now(),
      id: getID(),
      ...newMoneyAccount,
    }
    return from(this.dbPromise).pipe(
      concatMap((db) => {
        log('will save', moneyAccount)
        const savePromise = db
          .collection(moneyAccounts)
          .doc(moneyAccount.id)
          .set(moneyAccount)

        return from(savePromise)
      }),
    )
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
interface AltInterface {
  desiredAdd: (db: Firestore) => (nma: NewMoneyAccount) => Observable<MoneyAccount>
}
interface AltPatched {
  desiredAdd: (nma: NewMoneyAccount) => Observable<MoneyAccount>
}
export const altMoneyAccounts: AltInterface = {
  desiredAdd: (db) => (newMoneyAccount: NewMoneyAccount) => {
    log('alternative add', newMoneyAccount)
    const moneyAccount: MoneyAccount = {
      balance: newMoneyAccount.startingBalance,
      created: Date.now(),
      id: getID(),
      ...newMoneyAccount,
    }

    log('will save', moneyAccount)

    const savePromise = db
      .collection(moneyAccounts)
      .doc(moneyAccount.id)
      .set(moneyAccount)

    return of(moneyAccount)
  },
}

// 2.
// const original = altMoneyAccounts.desiredAdd

// const alt = (...args) =>
//   initDB.pipe(
//     concatMap((db) => {
//       log('asdf')
//       return original(db).apply(null, args)
//     }),
//   )
