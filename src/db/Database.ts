import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { from, Observable, of } from 'rxjs'

import { concatMap, map, pluck, shareReplay } from 'rxjs/operators'

import { mapValues } from 'lodash'
import { altMoneyAccounts, MoneyAccounts } from '~/db/db.moneyAccounts'
import { Log } from '~/utils/log'
import { CategoriesAPI, DatabaseAPI } from './API'
import { Categories } from './db.categories'
import { Transactions } from './Transactions'

const log = Log('Database:Init')

async function initFirestore(app: firebase.app.App, enablePersistence: boolean) {
  const settings: firebase.firestore.Settings = {
    timestampsInSnapshots: true,
  }

  firebase.firestore(app).settings(settings)

  if (enablePersistence) {
    try {
      await firebase.firestore(app).enablePersistence()
      log('Persistence enabled')
    } catch (error) {
      log('Persistence not enabled')
    }
  }

  const firestore = firebase.firestore(app)
  return firestore
}

const isReady = (promise: Promise<any>) => {
  let ready = false
  promise.then(() => (ready = true))
  return () => ready
}

interface DatabaseSettings {
  enablePersistence: boolean
}

export class Database implements DatabaseAPI {
  isReady: () => boolean

  initPromise: Promise<boolean>

  moneyAccounts: MoneyAccounts
  transactions: Transactions
  categories: CategoriesAPI

  constructor(app: firebase.app.App, { enablePersistence = true }: DatabaseSettings) {
    const dbPromise = initFirestore(app, enablePersistence)
    const initDB = from(dbPromise)
    this.isReady = isReady(dbPromise)
    this.moneyAccounts = new MoneyAccounts(dbPromise)

    // alt({ name: 'asdf', startingBalance: 1 }).subscribe((v) => log('s', v))

    // 1.
    // this.moneyAccounts.alternativeAdd({ name: 'nasdf', startingBalance: 0 }).subscribe((v) => {
    //   log('after subscription', v)
    // })

    this.transactions = new Transactions(dbPromise)
    this.categories = new Categories(dbPromise)
  }
}
