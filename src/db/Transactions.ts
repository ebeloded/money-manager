import firebase from 'firebase'

export default class Transactions {

  public async addTransaction (transaction: Transaction) {

    console.log('addTransaction', transaction)

    const firestore = await this.initDB

    return firestore.collection('transactions').add(transaction)
      .then((docRef) => {
        console.log('Document added with ID', docRef.id)
      })
      .catch((error) => {
        console.error('Error adding document', error)
      })

  }

  public async getAll (observer: (transactions: Transaction[]) => void) {

    console.log('get all called')

    const firestore = await this.initDB

    firestore.collection('transactions').onSnapshot((querySnapshot) => {
      const transactions: Transaction[] = []
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
