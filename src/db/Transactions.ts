import Debug from 'debug'
import { concatMap } from 'rxjs/operators'
import { Observable, from as fromPromise } from 'rxjs'

import { TransactionsAPI, Firestore } from './dbTypes'

const debug = Debug('Database.Transactions')

export class Transactions implements TransactionsAPI {
  constructor(private dbPromise: Promise<Firestore>) {}

  public async add(t: Transaction) {
    console.log('about to add', t)
    const db = await this.dbPromise
    const docRef = await db.collection('transactions').add(t)

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
        db =>
          new Observable<Transaction[]>(subscriber => {
            return db.collection('transactions').onSnapshot(querySnapshot => {
              const transactions: Transaction[] = []
              const result = querySnapshot.docs.map(d => {
                const t = { id: d.id, ...d.data() } as Transaction
                return t
              })
              subscriber.next(result)
            })
          }),
      ),
    )
  }

  public async remove(txid: TransactionID) {
    debug('remove %o', txid)
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
