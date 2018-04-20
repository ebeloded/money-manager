import firebase from 'firebase/app'
import 'firebase/firestore'

import { Transactions } from './Transactions'

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

interface DatabaseSettings {
  enablePersistence: boolean
}
interface DatabaseAPI {
  // constructor: (app: firebase.app.App, settings: DatabaseSettings) => void
  isReady: () => boolean
  transactions: Transactions
}

const isReady = (promise: Promise<any>) => {
  let isReady = false
  promise.then(() => (isReady = true))
  return () => isReady
}

export class Database implements DatabaseAPI {
  public isReady: () => boolean

  public initPromise: Promise<boolean>

  public transactions: Transactions

  constructor(app: firebase.app.App, { enablePersistence = true }: DatabaseSettings) {
    const dbPromise = initFirestore(app, enablePersistence)
    this.isReady = isReady(dbPromise)

    this.transactions = new Transactions(dbPromise)
  }
}

// export function initDatabase(enablePersistence: boolean = true): DatabaseAPI {
//   const dbPromise = initFirestore(enablePersistence)
//   let isReady = false

//   dbPromise.then(() => (isReady = true))

//   const api = {
//     isReady: () => isReady,
//     transactions: Transactions(dbPromise),
//   }

//   return api
// }
