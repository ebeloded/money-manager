import firebase from 'firebase/app'
import { Observable } from 'rxjs'
import * as uuid from 'uuid/v1'

type QuerySnapshot = firebase.firestore.QuerySnapshot

export const findByID = (array, searchId) => array.find(({ id }) => id === searchId)

export const querySnapshotToDocumentArray = <T extends { id: string }>(querySnapshot: QuerySnapshot): T[] => {
  return querySnapshot.docs.map((queryDocumentSnapshot) => {
    const result = {
      id: queryDocumentSnapshot.id,
      ...queryDocumentSnapshot.data(),
    }
    return result as T
  })
}

export const createSnapshotObservable = (query: firebase.firestore.CollectionReference) =>
  new Observable<QuerySnapshot>(query.onSnapshot.bind(query))

export const getID = uuid
