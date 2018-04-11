import firebase from 'firebase/app'

export default class Transactions {

  public async addTransaction (transaction: Transaction) {

    console.log('addTransaction', transaction)

    const firestore = await this.initDB

    return firestore.collection('transactions').add(transaction)

  }

  public async getAll (observer: (transactions: Transaction[]) => void) {

    console.log('get all called')

    observer([{ value: 999 }])

    const firestore = await this.initDB

    console.time('get_transactions')

    firestore.collection('transactions').onSnapshot((querySnapshot) => {
      const transactions: Transaction[] = []

      console.timeEnd('get_transactions')

      querySnapshot.forEach((doc) => {
        transactions.push(doc.data() as Transaction)
      })
      observer(transactions)
    })

  }

  constructor (private initDB: Promise<firebase.firestore.Firestore>) {
    console.log('init transactions subclass')

  }

}
