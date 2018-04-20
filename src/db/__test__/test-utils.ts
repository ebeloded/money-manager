import { Database } from '../Database'
import { initFirebase } from '../../firebase'

export const wait = (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export const initNonPersistentDatabase = (() => {
  let db: Database
  const app = initFirebase()

  return () => {
    if (!db) {
      db = new Database(app, { enablePersistence: false })
    }
    return db
  }
})()
