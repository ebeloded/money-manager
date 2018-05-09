import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { forkJoin, from, Observable, of } from 'rxjs'
import * as uuid from 'uuid/v4'

import { mapValues } from 'lodash'
import { concatMap, map, pluck, shareReplay } from 'rxjs/operators'
import { Log } from '~/utils/log'
import { Categories } from './db.categories'
import { MoneyAccounts } from './db.moneyAccounts'
import { Transactions } from './db.transactions'

const log = Log('Database:Init')

const firestoreFacade = (firestore: firebase.firestore.Firestore) => ({
  transactions: firestore.collection('transactions'),
})
type QuerySnapshot = firebase.firestore.QuerySnapshot
type Query = firebase.firestore.Query

export class FirestoreFacade {
  categories = this.firestore.collection('categories')
  transactions = this.firestore.collection('transactions')
  moneyAccounts = this.firestore.collection('moneyAccounts')
  constructor(private firestore: firebase.firestore.Firestore) {}

  batch = () => this.firestore.batch()
  createSnapshotObservable = (query: Query) => new Observable<QuerySnapshot>(query.onSnapshot.bind(query))
  querySnapshotToDocumentArray = <T>(querySnapshot: QuerySnapshot): T[] =>
    querySnapshot.docs.map((queryDocumentSnapshot) => queryDocumentSnapshot.data() as T)
}

interface DatabaseSettings {
  enablePersistence: boolean
}

export class Database {
  static generateID() {
    return uuid()
  }

  moneyAccounts: MoneyAccounts
  transactions: Transactions
  categories: Categories

  constructor(app: firebase.app.App, { enablePersistence = true }: DatabaseSettings) {
    const firestorePromise = initFirestore(app, enablePersistence)

    const init = {
      db: this,
      firestore: from(firestorePromise).pipe(map((firestore) => new FirestoreFacade(firestore))),
    }

    this.moneyAccounts = new MoneyAccounts(init)
    this.categories = new Categories(init)
    this.transactions = new Transactions(init)
  }
}

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
