import * as firebase from 'firebase/app'
import { Observable } from 'rxjs'

type Firestore = firebase.firestore.Firestore

interface TransactionsAPI {
  add: (t: Transaction) => Promise<TransactionID>
  get: (txid: TransactionID) => Promise<Transaction>
  all: () => Observable<Transaction[]>
  remove: (txid: TransactionID) => Promise<boolean>
}

interface CategoriesAPI {
  add: (c: NewCategory) => Promise<CategoryID>
  all: () => Observable<Category[]>
  get: (cid: CategoryID) => Promise<Category>
  // edit: (c: Category) => Promise<Category>
  remove: (cid: CategoryID, moveTransactionsTo?: CategoryID) => Promise<boolean>
}

interface DatabaseAPI {
  isReady: () => boolean
  transactions: TransactionsAPI
  categories: CategoriesAPI
}
