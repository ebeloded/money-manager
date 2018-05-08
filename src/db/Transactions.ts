import * as firebase from 'firebase/app'
import { from as fromPromise, Observable } from 'rxjs'
import { concatMap } from 'rxjs/operators'

import { NewTransaction, Transaction, TransactionID } from '~/types'
import { Log } from '~/utils/log'
import { Firestore, TransactionsAPI } from './API'

const debug = Log('Database:Transactions')

export class Transactions implements TransactionsAPI {
  constructor(private dbPromise: Promise<Firestore>) {}

  async add(t: NewTransaction): Promise<TransactionID> {
    debug('add %o', t)
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

  all() {
    return fromPromise(this.dbPromise).pipe(
      concatMap(
        (db) =>
          new Observable<Transaction[]>((subscriber) => {
            return db
              .collection('transactions')
              .orderBy('created', 'desc')
              .onSnapshot((querySnapshot) => {
                const transactions: Transaction[] = []
                const result = querySnapshot.docs.map((d) => {
                  return { id: d.id, ...d.data() }
                }) as Transaction[]
                debug('received transactions %O', result)
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
