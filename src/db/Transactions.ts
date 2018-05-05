import Debug from 'debug'
import firebase from 'firebase/app'
import { concatMap } from 'rxjs/operators'
import { Observable, from as fromPromise, from, defer } from 'rxjs'

import { TransactionsAPI, Firestore } from './dbTypes'

const debug = Debug('Database.Transactions')

export class Transactions implements TransactionsAPI {
  constructor(private dbPromise: Promise<Firestore>) {}

  async add(t: NewTransaction): Promise<TransactionID> {
    const db = await this.dbPromise

    const docRef = await db.collection('transactions').add({
      created: Date.now(),
      ...t,
    } as Transaction)

    return docRef.id
  }

  public async get(txid: TransactionID) {
    const db = await this.dbPromise

    const doc = await db
      .collection('transactions')
      .doc(txid)
      .get()

    const data = doc.data() as Transaction

    return data
  }

  public list() {
    debug('list')
    return fromPromise(this.dbPromise).pipe(
      concatMap(
        (db) =>
          new Observable<Transaction[]>((subscriber) => {
            return db.collection('transactions').onSnapshot((querySnapshot) => {
              const transactions: Transaction[] = []
              const result = querySnapshot.docs.map((d) => {
                return { id: d.id, ...d.data() } as Transaction
              })
              console.log('calculate result', result)
              subscriber.next(result)
            })
          }),
      ),
    )
  }

  public async remove(txid: TransactionID) {
    const db = await this.dbPromise

    await db
      .collection('transactions')
      .doc(txid)
      .delete()

    return true
  }
}

// export function TransactionsF(firestorePromise: Promise<Firestore>): TransactionsAPI {
//   const api: TransactionsAPI = {
//     add: async t => {},
//     list: () => {
//       return fromPromise(firestorePromise).concatMap(
//         db =>
//           new Observable<Transaction[]>(subscriber => {
//             return db.collection('transactions').onSnapshot(querySnapshot => {
//               const transactions: Transaction[] = []
//               const result = querySnapshot.docs.map(d => d.data() as Transaction)
//               subscriber.next(result)
//             })
//           }),
//       )
//     },
//     remove: async txid => {
//       return true
//     },
//   }

//   return api
// }
//TODO: Implement debug decorator
