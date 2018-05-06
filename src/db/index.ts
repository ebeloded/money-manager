import Debug from 'debug'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { Categories } from './Categories'
import { CategoriesAPI, DatabaseAPI } from './dbTypes'
import { Transactions } from './Transactions'

const debug = Debug('Database:Init')

async function initFirestore(app: firebase.app.App, enablePersistence: boolean) {
  const settings: firebase.firestore.Settings = {
    timestampsInSnapshots: true,
  }

  firebase.firestore(app).settings(settings)

  if (enablePersistence) {
    try {
      await firebase.firestore(app).enablePersistence()
      debug('Persistence enabled')
    } catch (error) {
      debug('Persistence not enabled')
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

export class Database implements DatabaseAPI {
  isReady: () => boolean

  initPromise: Promise<boolean>

  transactions: Transactions
  categories: CategoriesAPI

  constructor(app: firebase.app.App, { enablePersistence = true }: DatabaseSettings) {
    const dbPromise = initFirestore(app, enablePersistence)
    this.isReady = isReady(dbPromise)
    this.transactions = new Transactions(dbPromise)
    this.categories = Categories(dbPromise)
  }
}
