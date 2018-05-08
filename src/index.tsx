import { Database } from '~/db/Database'
import { DatabaseProvider } from '~/db/react-db/DatabaseContext'
import { App } from './components/App'
import { initFirebase } from './firebase'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

const firebaseApp = initFirebase()

const db = new Database(firebaseApp, { enablePersistence: true })

// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <DatabaseProvider db={db}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </DatabaseProvider>,
  document.getElementById('root') as HTMLElement,
)

// registerServiceWorker();
