import Debug from 'debug'
import { from as fromPromise, Observable } from 'rxjs'
import { concatMap, publishLast, share, shareReplay } from 'rxjs/operators'
import { CategoriesAPI, Firestore } from './dbTypes'

const debug = Debug('Database:Categories')

const add = (dbPromise: Promise<Firestore>) => async (c: NewCategory) => {
  const db = await dbPromise

  const categoryRef = await db.collection('categories').add({
    created: Date.now(),
    ...c,
  })

  return categoryRef.id
}

const remove = (dbPromise: Promise<Firestore>) => async (cid: CategoryID) => {
  const db = await dbPromise

  await db
    .collection('categories')
    .doc(cid)
    .delete()

  return true
}

const get = (dbPromise: Promise<Firestore>) => async (txid: CategoryID): Promise<Category> => {
  const db = await dbPromise
  const docRef = await db
    .collection('categories')
    .doc(txid)
    .get()

  return {
    id: docRef.id,
    ...(docRef.data() as Category),
  }
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
          const result = querySnapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Category[]

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
    get: get(dbPromise),
    getAll: getAll(dbPromise),
    remove: remove(dbPromise),
  }

  return api
}
