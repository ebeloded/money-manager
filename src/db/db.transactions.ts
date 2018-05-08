import * as firebase from 'firebase/app'
import { from, from as fromPromise, Observable } from 'rxjs'
import { concatMap, map } from 'rxjs/operators'

import { createSnapshotObservable, querySnapshotToDocumentArray } from '~/db/utils'
import { CreatedTransaction, NewTransaction, TransactionID } from '~/types'
import { Log } from '~/utils/log'
import { Firestore } from '.'

const debug = Log('Database:Transactions')

const transactions = 'transactions'

export class Transactions {
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

  all = from(this.dbPromise).pipe(
    concatMap((db) =>
      createSnapshotObservable(db.collection(transactions).orderBy('created', 'desc')).pipe(
        map((querySnapshot) => {
          return querySnapshotToDocumentArray<CreatedTransaction>(querySnapshot)
        }),
      ),
    ),
  )

  async remove(txid: TransactionID) {
    const db = await this.dbPromise

    await db
      .collection('transactions')
      .doc(txid)
      .delete()

    return true
  }
}
