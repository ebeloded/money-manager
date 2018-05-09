import { FirebaseFirestore, Query, QuerySnapshot, Settings } from '@firebase/firestore-types'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { empty, forkJoin, from, Observable, of } from 'rxjs'
import * as uuid from 'uuid/v4'

import { FirebaseApp } from '@firebase/app-types'
import { mapValues } from 'lodash'
import { catchError, concatMap, map, mapTo, pluck, shareReplay } from 'rxjs/operators'
import { Log } from '~/utils/log'
import { Categories } from './db.categories'
import { MoneyAccounts } from './db.moneyAccounts'
import { Transactions } from './db.transactions'

const log = Log('Database:Init')

const firestoreFacade = (firestore: FirebaseFirestore) => ({
  transactions: firestore.collection('transactions'),
})

export class FirestoreFacade {
  categories = this.firestore.collection('categories')
  transactions = this.firestore.collection('transactions')
  moneyAccounts = this.firestore.collection('moneyAccounts')
  constructor(private firestore: FirebaseFirestore) {}

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

  constructor(firebaseApp?, enablePersistence = true) {
    if (firebaseApp) {
      const firestoreInit = initFirestore(firebaseApp, enablePersistence)

      const init = {
        db: this,
        firestore: firestoreInit.pipe(map((firestore) => new FirestoreFacade(firestore))),
      }

      this.moneyAccounts = new MoneyAccounts(init)
      this.categories = new Categories(init)
      this.transactions = new Transactions(init)
    }
  }
}

function initFirestore(firebaseApp: FirebaseApp, enablePersistence) {
  // HACK, related issue: https://github.com/firebase/firebase-js-sdk/issues/791
  // tslint:disable-next-line:no-string-literal
  const firebaseFirestore = firebase['firestore'] as (app?: FirebaseApp) => FirebaseFirestore

  firebaseFirestore(firebaseApp).settings({
    timestampsInSnapshots: true,
  })

  const firestore = firebaseFirestore(firebaseApp)

  return from(firestore.enablePersistence()).pipe(
    catchError((err) => {
      log('No Persistence', err)
      return empty()
    }),
    mapTo(firestore),
  )
}
