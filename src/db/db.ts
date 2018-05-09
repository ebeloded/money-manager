import { FirebaseFirestore, Query, QuerySnapshot, Settings } from '@firebase/firestore-types'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { empty, forkJoin, from, Observable, of } from 'rxjs'
import * as uuid from 'uuid/v4'

import { FirebaseApp } from '@firebase/app-types'
import { mapValues } from 'lodash'
import { catchError, concatMap, map, mapTo, pluck, shareReplay } from 'rxjs/operators'
import * as DB from '~/types'
import { Log } from '~/utils/log'
import { Categories } from './db.categories'
import { MoneyAccounts } from './db.moneyAccounts'
import { Transactions } from './db.transactions'

const log = Log('Database:Init')

declare module '@firebase/firestore-types' {
  interface SpecialisedDocumentReference<T extends DocumentData | UpdateData> extends DocumentReference {
    set(data: T, options?: SetOptions): Promise<void>
    update(data: Partial<T>): Promise<void>
    update(field: keyof T, value: any, ...moreFieldsAndValues: any[]): Promise<void>
  }

  interface SpecializedQuery<T> extends Query {
    where(fieldPath: keyof T, opStr: WhereFilterOp, value: any): SpecializedQuery<T>
    orderBy(fieldPath: keyof T, directionStr?: OrderByDirection): SpecializedQuery<T>
  }

  interface SpecializedCollectionReference<T> extends CollectionReference {
    add(data: T): Promise<DocumentReference>
    doc(documentPath?: string): SpecialisedDocumentReference<T>
    where(fieldPath: keyof T, opStr: WhereFilterOp, value: any): SpecializedQuery<T>
    orderBy(fieldPath: keyof T, directionStr?: OrderByDirection): SpecializedQuery<T>
  }

  export interface FirebaseFirestore {
    collection(collectionPath: 'categories'): SpecializedCollectionReference<DB.Category>
    collection(collectionPath: 'transactions'): SpecializedCollectionReference<DB.Transaction>
    collection(collectionPath: 'moneyAccounts'): SpecializedCollectionReference<DB.MoneyAccount>
  }
}

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
      const init = {
        db: this,
        firestore: from(initFirestore(firebaseApp, enablePersistence)).pipe(
          map((firestore) => new FirestoreFacade(firestore)),
        ),
      }

      this.moneyAccounts = new MoneyAccounts(init)
      this.categories = new Categories(init)
      this.transactions = new Transactions(init)
    }
  }
}

async function initFirestore(firebaseApp: FirebaseApp, enablePersistence: boolean) {
  // HACK, related issue: https://github.com/firebase/firebase-js-sdk/issues/791
  // tslint:disable-next-line:no-string-literal
  const firestore = firebase['firestore'] as (app?: FirebaseApp) => FirebaseFirestore

  const settings: Settings = {
    timestampsInSnapshots: true,
  }

  firestore(firebaseApp).settings(settings)

  if (enablePersistence) {
    try {
      await firestore(firebaseApp).enablePersistence()
      log('Persistence enabled')
    } catch (error) {
      log('Persistence disabled')
    }
  }

  return firestore()
}
