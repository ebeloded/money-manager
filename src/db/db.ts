import firebase from 'firebase/app'
import 'firebase/firestore'
import { mapValues } from 'lodash'
import { empty, forkJoin, from, Observable, of } from 'rxjs'
import { catchError, concatMap, map, mapTo, pluck, shareReplay } from 'rxjs/operators'
import * as uuid from 'uuid/v4'
import { FirestoreFacade } from '~/db/FirestoreFacade'

import { FirebaseApp } from '@firebase/app-types'
import { FirebaseFirestore } from '@firebase/firestore-types'
import { Log } from '~/utils/log'
import { Categories } from './db.categories'
import { MoneyAccounts } from './db.moneyAccounts'
import { Transactions } from './db.transactions'

const log = Log('Database:Init')

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
