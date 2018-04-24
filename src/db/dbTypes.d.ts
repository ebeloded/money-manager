import { Observable } from 'rxjs/Observable'
import firebase from 'firebase/app'

type Firestore = firebase.firestore.Firestore

interface TransactionsAPI {
  add: (t: Transaction) => Promise<TransactionID>
  get: (txid: TransactionID) => Promise<Transaction>
  list: () => Observable<Transaction[]>
  remove: (txid: TransactionID) => Promise<boolean>
}

interface CategoriesAPI {
  add: (c: NewCategory) => Promise<Category>
  getAll: () => Observable<Category[]>
  get: (cid: CategoryID) => Promise<Category>
  // edit: (c: Category) => Promise<Category>
  // remove: (cid: CategoryID, to?: CategoryID) => Promise<boolean>
}

interface DatabaseAPI {
  isReady: () => boolean
  transactions: TransactionsAPI
  categories: CategoriesAPI
}