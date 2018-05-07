import { from, Observable, of } from 'rxjs'
import { concatMap, map, shareReplay } from 'rxjs/operators'
import { Firestore } from '~/db/API'
import { Log } from '~/utils/log'
import { createSnapshotObservable, getID, querySnapshotToDocumentArray } from './dbutils'

const moneyAccounts = 'moneyAccounts'
const debug = Log('Database.MoneyCategories')

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
