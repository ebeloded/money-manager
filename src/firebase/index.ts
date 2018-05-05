import firebase from 'firebase/app'
import config from '../config/firebase.config'

let app: firebase.app.App | undefined

export function initFirebase() {
  if (!app) {
    app = firebase.initializeApp(config)
  }
  return app
}
