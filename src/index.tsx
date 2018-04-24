import { initFirebase } from './firebase'
import { Database } from './db/Database'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from 'components/App'
import { DatabaseProvider } from 'db/DatabaseContext'

const firebaseApp = initFirebase()

const db = new Database(firebaseApp, { enablePersistence: true })

// // import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <DatabaseProvider db={db}>
    <App />
  </DatabaseProvider>,

  document.getElementById('root') as HTMLElement,
)

// // registerServiceWorker();
