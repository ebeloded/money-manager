import { initFirebase } from './firebase'
import { Database } from './db/Database'

// import React from 'react'
// import * as ReactDOM from 'react-dom'
// import App from './App'

// // import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)

// // registerServiceWorker();

const app = initFirebase()

const db = new Database(app, { enablePersistence: true })

db.transactions.list().subscribe(x => console.log(x))

async function addTransaction() {
  const txid = await db.transactions.add({ value: 100 })
  console.log('txid', txid)
}

addTransaction()
