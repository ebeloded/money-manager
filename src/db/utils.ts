import * as firebase from 'firebase/app'
import { Observable } from 'rxjs'
import * as uuid from 'uuid/v4'

type QuerySnapshot = firebase.firestore.QuerySnapshot

export const findByID = (array, searchId) => array.find(({ id }) => id === searchId)

export const querySnapshotToDocumentArray = <T>(querySnapshot: QuerySnapshot): T[] =>
  querySnapshot.docs.map((queryDocumentSnapshot) => queryDocumentSnapshot.data() as T)

export const createSnapshotObservable = (query: firebase.firestore.Query) =>
  new Observable<QuerySnapshot>(query.onSnapshot.bind(query))

export const getID = uuid
