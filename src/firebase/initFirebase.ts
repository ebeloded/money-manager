import firebase from '@firebase/app'
import { FirebaseApp } from '@firebase/app-types'

let app: FirebaseApp

const config = {
  apiKey: 'AIzaSyDGMhDY0GbP_l5zqNYjkVnUY3wR2A1Sq9M',
  authDomain: 'money-manager-60e74.firebaseapp.com',
  databaseURL: 'https://money-manager-60e74.firebaseio.com',
  messagingSenderId: '711436554616',
  projectId: 'money-manager-60e74',
  storageBucket: 'money-manager-60e74.appspot.com',
}

export function initFirebase() {
  if (!app) {
    app = firebase.initializeApp(config)
  }
  return app
}
