import Debug from 'debug'
import firebase from 'firebase/app'
import { defer, from, from as fromPromise, Observable } from 'rxjs'
import { concatMap } from 'rxjs/operators'

import { Firestore, TransactionsAPI } from './dbTypes'

const debug = Debug('Database.Transactions')

export class Transactions implements TransactionsAPI {
  constructor(private dbPromise: Promise<Firestore>) {}

  async add(t: NewTransaction): Promise<TransactionID> {
    const db = await this.dbPromise

    const docRef = await db.collection('transactions').add({
      created: Date.now(),
      ...t,
    })

    return docRef.id
  }

  async get(txid: TransactionID) {
    const db = await this.dbPromise

    const doc = await db
      .collection('transactions')
      .doc(txid)
      .get()

    const data = doc.data() as Transaction

    return data
  }

  list() {
    debug('list')
    return fromPromise(this.dbPromise).pipe(
      concatMap(
        (db) =>
          new Observable<Transaction[]>((subscriber) => {
            return db.collection('transactions').onSnapshot((querySnapshot) => {
              const transactions: Transaction[] = []
              const result = querySnapshot.docs.map((d) => {
                return { id: d.id, ...d.data() }
              }) as Transaction[]

              subscriber.next(result)
            })
          }),
      ),
    )
  }

  async remove(txid: TransactionID) {
    const db = await this.dbPromise

    await db
      .collection('transactions')
      .doc(txid)
      .delete()

    return true
  }
}
