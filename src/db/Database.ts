import firebase from 'firebase'
import 'firebase/firestore'
import Transactions from './Transactions'

export default class Database {

  public transactions: Transactions

  public isInitialized: Boolean

  private initDB: Promise<firebase.firestore.Firestore>

  constructor () {

    this.initDB = this.initPersistentFirestore()
    this.initDB.then(() => {
      this.isInitialized = true
    })
    this.transactions = new Transactions(this.initDB)

  }

  private async initPersistentFirestore () {
    try {
      await firebase.firestore().enablePersistence()
    } finally {
      return firebase.firestore()
    }
  }
}
