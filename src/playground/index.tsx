/*
type QuerySnapshot = firebase.firestore.QuerySnapshot

const querySnapshotToDocumentArray = <T extends { id: string }>(querySnapshot: QuerySnapshot): T[] => {
  debug('querySnapshotToDocumentArray')
  return querySnapshot.docs.map((queryDocumentSnapshot) => {
    const result = {
      id: queryDocumentSnapshot.id,
      ...queryDocumentSnapshot.data(),
    }
    return result as T
  })
}

const createSnapshotObservable = (query: firebase.firestore.CollectionReference) =>
  new Observable<QuerySnapshot>(query.onSnapshot.bind(query))

const CategoriesObservable = (db: firebase.firestore.Firestore) => {
  
  return createSnapshotObservable(db.collection('categories'))
    .pipe(map((querySnapshot) => querySnapshotToDocumentArray<Category>(querySnapshot)))
    .pipe(shareReplay())
}
function fetchCategories(dbPromise: Promise<firebase.firestore.Firestore>) {
  const categoriesObservable = from(dbPromise).pipe(concatMap(CategoriesObservable))

  categoriesObservable.subscribe((x) => {
    debug('play', x)
  })

  categoriesObservable.subscribe((x) => {
    debug('play2', x)
  })
}
*/
