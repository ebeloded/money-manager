import firebase from 'firebase/app'
import 'firebase/firestore'

import { Transactions } from './Transactions'
import { CategoriesAPI, DatabaseAPI } from './dbTypes'
import { Categories } from './Categories'

async function initFirestore(app: firebase.app.App, enablePersistence: boolean) {
  const settings: firebase.firestore.Settings = {
    timestampsInSnapshots: true,
  }

  firebase.firestore(app).settings(settings)

  if (enablePersistence) {
    try {
      await firebase.firestore(app).enablePersistence()
      console.log('persistence enabled')
    } catch (error) {
      console.warn(error)
    }
  }

  const firestore = firebase.firestore(app)
  console.log('returning firestore')
  return firestore
}

const isReady = (promise: Promise<any>) => {
  let isReady = false
  promise.then(() => (isReady = true))
  return () => isReady
}

export class Database implements DatabaseAPI {
  public isReady: () => boolean

  public dbName = 'My Database'

  public initPromise: Promise<boolean>

  public transactions: Transactions
  public categories: CategoriesAPI

  constructor(app: firebase.app.App, { enablePersistence = true }: DatabaseSettings) {
    const dbPromise = initFirestore(app, enablePersistence)
    this.isReady = isReady(dbPromise)
    this.transactions = new Transactions(dbPromise)
    this.categories = Categories(dbPromise)
  }
}
