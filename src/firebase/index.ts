import config from '../config/firebase.config'
import firebase from 'firebase/app'

let app: firebase.app.App | undefined

export function initFirebase() {
  if (!app) {
    app = firebase.initializeApp(config)
  }
  return app
}
