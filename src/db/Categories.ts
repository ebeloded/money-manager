import { Firestore, CategoriesAPI } from './dbTypes'
import { concatMap } from 'rxjs/operators'
import { Observable } from 'rxjs/Observable'
import { fromPromise } from 'rxjs/observable/fromPromise'

const add = (dbPromise: Promise<Firestore>) => async (c: NewCategory) => {
  const db = await dbPromise

  const categoryRef = await db.collection('categories').add(c)

  const result: Category = { ...c, id: categoryRef.id }

  return result
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

const getAll = (dbPromise: Promise<Firestore>) => (): Observable<Category[]> =>
  fromPromise(dbPromise).pipe(
    concatMap(
      (db: Firestore) =>
        new Observable<Category[]>(subscriber => {
          return db.collection('categories').onSnapshot(querySnapshot => {
            const categories: Category[] = []

            const result = querySnapshot.docs.map(
              d =>
                ({
                  id: d.id,
                  ...d.data(),
                } as Category),
            )
            subscriber.next(result)
          })
        }),
    ),
  )

export function Categories(dbPromise: Promise<Firestore>): CategoriesAPI {
  const api: CategoriesAPI = {
    add: add(dbPromise),
    getAll: getAll(dbPromise),
    get: get(dbPromise),
  }

  return api
}
