import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirebaseFirestore,
  OrderByDirection,
  Query,
  QuerySnapshot,
  SetOptions,
  SnapshotListenOptions,
  SnapshotOptions,
  UpdateData,
  WhereFilterOp,
  WriteBatch,
} from '@firebase/firestore-types'
import 'firebase/firestore'

import { Observable } from 'rxjs'
import * as DB from '~/types'

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

export class FirestoreFacade {
  accounts = this.firestore.collection('accounts') as $$CollectionReference<DB.Account>
  categories = this.firestore.collection('categories') as $$CollectionReference<DB.Category>
  transactions = this.firestore.collection('transactions') as $$CollectionReference<DB.Transaction>

  constructor(private firestore: FirebaseFirestore) {}

  batch = () => this.firestore.batch() as $$WriteBatch
  createSnapshotObservable = <T>(query: $$Query<T>) => new Observable<$$QuerySnapshot<T>>(query.onSnapshot.bind(query))
  querySnapshotToDocumentArray = <T>(querySnapshot: $$QuerySnapshot<T>) =>
    querySnapshot.docs.map((queryDocumentSnapshot) => queryDocumentSnapshot.data())
}
