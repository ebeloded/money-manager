import config from '../config/firebase.config'
import firebase from 'firebase/app'

let app: firebase.app.App | undefined

export function initFirebase() {
  console.log('initFirebase')
  if (!app) {
    app = firebase.initializeApp(config)
    console.log(`${app.name} initialized`)
  }
  return app
}
