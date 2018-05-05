import { Firestore, CategoriesAPI } from './dbTypes'
import { concatMap, shareReplay, share, publishLast } from 'rxjs/operators'
import { Observable, from as fromPromise } from 'rxjs'
import Debug from 'debug'

const debug = Debug('App:Database:Categories')

const add = (dbPromise: Promise<Firestore>) => async (c: NewCategory) => {
  const db = await dbPromise

  const categoryRef = await db.collection('categories').add({
    created: Date.now(),
    ...c,
  })

  return categoryRef.id
}

const get = (dbPromise: Promise<Firestore>) => async (txid: CategoryID): Promise<Category> => {
  const db = await dbPromise
  const docRef = await db
    .collection('categories')
    .doc(txid)
    .get()

  return {
    id: docRef.id,
    ...docRef.data(),
  } as Category
}

const getCategoriesObservable = (() => {
  let categoriesObservable

  return (db) => {
    categoriesObservable =
      categoriesObservable ||
      new Observable<Category[]>((subscriber) => {
        debug('loading categories')
        return db.collection('categories').onSnapshot((querySnapshot) => {
          const categories: Category[] = []
          const result = querySnapshot.docs.map(
            (d) =>
              ({
                id: d.id,
                ...d.data(),
              } as Category),
          )

          subscriber.next(result)
        })
      }).pipe(shareReplay(1))

    return categoriesObservable
  }
})()

const getAll = (dbPromise: Promise<Firestore>) => (): Observable<Category[]> =>
  fromPromise(dbPromise).pipe(concatMap((db: Firestore) => getCategoriesObservable(db)))

export function Categories(dbPromise: Promise<Firestore>): CategoriesAPI {
  const api: CategoriesAPI = {
    add: add(dbPromise),
    getAll: getAll(dbPromise),
    get: get(dbPromise),
  }

  return api
}
