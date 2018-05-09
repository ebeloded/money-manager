import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirebaseFirestore,
  OrderByDirection,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  SetOptions,
  Settings,
  SnapshotListenOptions,
  SnapshotOptions,
  UpdateData,
  WhereFilterOp,
  WriteBatch,
} from '@firebase/firestore-types'
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

// declare module '@firebase/firestore-types' {
interface $$DocumentReference<T extends DocumentData | UpdateData> extends DocumentReference {
  set(data: T, options?: SetOptions): Promise<void>
  update(data: Partial<T>): Promise<void>
  update(field: keyof T, value: any, ...moreFieldsAndValues: any[]): Promise<void>
}

interface $$DocumentSnapshot<T> extends DocumentSnapshot {
  ref: $$DocumentReference<T>
  get(fieldPath: keyof T, options?: SnapshotOptions): any
}

interface $$QueryDocumentSnapshot<T extends DocumentData> extends $$DocumentSnapshot<T> {
  data(options?: SnapshotOptions): T
}

interface $$QuerySnapshot<T> extends QuerySnapshot {
  readonly docs: Array<$$QueryDocumentSnapshot<T>>
}

interface $$Query<T> extends Query {
  where(fieldPath: keyof T, opStr: WhereFilterOp, value: any): $$Query<T>
  orderBy(fieldPath: keyof T, directionStr?: OrderByDirection): $$Query<T>
  onSnapshot(observer: {
    next?: (snapshot: $$QuerySnapshot<T>) => void
    error?: (error: Error) => void
    complete?: () => void
  }): () => void
  onSnapshot(
    options: SnapshotListenOptions,
    observer: {
      next?: (snapshot: $$QuerySnapshot<T>) => void
      error?: (error: Error) => void
      complete?: () => void
    },
  ): () => void
  onSnapshot(
    onNext: (snapshot: $$QuerySnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void,
  ): () => void
  onSnapshot(
    options: SnapshotListenOptions,
    onNext: (snapshot: $$QuerySnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void,
  ): () => void
}

interface $$CollectionReference<T> extends $$Query<T> {
  readonly id: string
  readonly parent: DocumentReference | null
  readonly path: string
  isEqual(other: CollectionReference): boolean
  add(data: T): Promise<$$DocumentReference<T>>
  doc(documentPath?: string): $$DocumentReference<T>
}
interface $$WriteBatch extends WriteBatch {
  set<T>(documentRef: $$DocumentReference<T>, data: T, options?: SetOptions): $$WriteBatch
  update<T>(documentRef: $$DocumentReference<T>, data: Partial<T>): $$WriteBatch
  update<T>(
    documentRef: $$DocumentReference<T>,
    field: keyof T,
    value: any,
    ...moreFieldsAndValues: any[]
  ): $$WriteBatch
  delete(documentRef: DocumentReference): $$WriteBatch
}

const firestoreFacade = (firestore: FirebaseFirestore) => ({
  transactions: firestore.collection('transactions'),
})

export class FirestoreFacade {
  categories = this.firestore.collection('categories') as $$CollectionReference<DB.Category>
  transactions = this.firestore.collection('transactions') as $$CollectionReference<DB.Transaction>
  moneyAccounts = this.firestore.collection('moneyAccounts') as $$CollectionReference<DB.MoneyAccount>
  constructor(private firestore: FirebaseFirestore) {}

  batch = () => this.firestore.batch() as $$WriteBatch
  createSnapshotObservable = <T>(query: $$Query<T>) => new Observable<$$QuerySnapshot<T>>(query.onSnapshot.bind(query))
  querySnapshotToDocumentArray = <T>(querySnapshot: $$QuerySnapshot<T>) =>
    querySnapshot.docs.map((queryDocumentSnapshot) => queryDocumentSnapshot.data())
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
