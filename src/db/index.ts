import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { from, Observable, of } from 'rxjs'

import { mapValues } from 'lodash'
import { concatMap, map, pluck, shareReplay } from 'rxjs/operators'
import { Log } from '~/utils/log'
import { Categories } from './db.categories'
import { MoneyAccounts } from './db.moneyAccounts'
import { Transactions } from './db.transactions'

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

export type Firestore = firebase.firestore.Firestore

export class Database {
  isReady: () => boolean

  initPromise: Promise<boolean>

  moneyAccounts: MoneyAccounts
  transactions: Transactions
  categories: Categories

  constructor(app: firebase.app.App, { enablePersistence = true }: DatabaseSettings) {
    const dbPromise = initFirestore(app, enablePersistence)
    // const initDB = from(dbPromise)
    this.isReady = isReady(dbPromise)
    this.moneyAccounts = new MoneyAccounts(dbPromise)
    this.categories = new Categories(dbPromise)
    this.transactions = new Transactions(dbPromise)
  }
}
