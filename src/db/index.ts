import firebase from 'firebase'
import config from './firebase.config'
import Database from './Database'

firebase.initializeApp(config)

const db = new Database()

export default db