import firebase from 'firebase'
import 'firebase/firestore'
import Transactions from './Transactions'

async function initPersistentFirestore () {
  try {
    await firebase.firestore().enablePersistence()
  } finally {
    return firebase.firestore()
  }
}

export default class Database {

  public transactions: Transactions

  public isInitialized: Boolean

  constructor () {

    const firestorePromise = initPersistentFirestore()

    console.time('init_db')

    firestorePromise.then(() => {
      console.timeEnd('init_db')
      this.isInitialized = true
    })

    this.transactions = new Transactions(firestorePromise)

  }

}
