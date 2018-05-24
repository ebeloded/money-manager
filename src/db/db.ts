import firebase from '@firebase/app'
import 'firebase/firestore'
import { flatten } from 'lodash'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import * as uuid from 'uuid/v4'
import { FirestoreFacade } from '~/db/FirestoreFacade'

import { FirebaseApp } from '@firebase/app-types'
import { FirebaseFirestore } from '@firebase/firestore-types'
import { Accounts } from '~/db/db.accounts'
import { Log } from '~/utils/log'
import { Categories } from './db.categories'
import { Transactions } from './db.transactions'

const log = Log('Database:Init')

export interface ConstructorProps {
  db: Database
  firestore: Observable<FirestoreFacade>
}

export class Database {
  static generateID() {
    return uuid()
  }

  accounts: Accounts
  transactions: Transactions
  categories: Categories

  constructor(firebaseApp?, enablePersistence = true) {
    log('construct DB')
    if (firebaseApp) {
      const init: ConstructorProps = {
        db: this,
        firestore: from(initFirestore(firebaseApp, enablePersistence)).pipe(
          map((firestore) => new FirestoreFacade(firestore)),
        ),
      }

      this.accounts = new Accounts(init)
      this.categories = new Categories(init)
      this.transactions = new Transactions(init)

      // ! For Dev purposes only
      // tslint:disable-next-line:no-string-literal
      window['purgeDataStore'] = purgeDataStore(init)
    }
  }
}

const purgeDataStore = (init: ConstructorProps) => () => {
  init.firestore.subscribe(async (firestore) => {
    const batch = firestore.batch()
    const resolveAllCollections = await Promise.all([
      firestore.transactions.get(),
      firestore.categories.get(),
      firestore.accounts.get(),
    ])

    flatten(resolveAllCollections.map((qs) => qs.docs)).forEach((doc) => {
      log('removing', doc.data())
      batch.delete(doc.ref)
    })

    batch.commit()
  })
}

async function initFirestore(firebaseApp: FirebaseApp, enablePersistence: boolean) {
  // HACK, related issue: https://github.com/firebase/firebase-js-sdk/issues/791
  // tslint:disable-next-line:no-string-literal
  const firestore = firebase['firestore'] as (app?: FirebaseApp) => FirebaseFirestore

  const settings = {
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
