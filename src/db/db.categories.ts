import * as firebase from 'firebase/app'
import { from, Observable } from 'rxjs'
import { concatMap, first, map, shareReplay, take, tap } from 'rxjs/operators'
import { createSnapshotObservable, getID, querySnapshotToDocumentArray } from '~/db/utils'
import { Category, CategoryID, CategoryType, NewCategory } from '~/types'
import { Log } from '~/utils/log'
import { Firestore } from '.'

const log = Log('db.categories')

const categories = 'categories'

export const NO_CATEGORY = {
  created: 0,
  id: 'NO_CATEGORY_ID',
  name: 'No Category',
}

const NO_CATEGORY_EXPENSE: Category = {
  ...NO_CATEGORY,
  categoryType: CategoryType.EXPENSE,
}
const NO_CATEGORY_INCOME: Category = {
  ...NO_CATEGORY,
  categoryType: CategoryType.INCOME,
}

export class Categories {
  all = from(this.dbPromise).pipe(
    concatMap((db) =>
      createSnapshotObservable(db.collection(categories))
        .pipe(
          map((querySnapshot) => querySnapshotToDocumentArray<Category>(querySnapshot)),
          map((cats) => [...cats, NO_CATEGORY_EXPENSE, NO_CATEGORY_INCOME]),
        )
        .pipe(shareReplay()),
    ),
  )

  constructor(private dbPromise: Promise<Firestore>) {}

  add = async (newCategory: NewCategory) => {
    const category: Category = {
      created: Date.now(),
      id: getID(),
      ...newCategory,
    }

    log('add', category)

    const db = await this.dbPromise

    const categoryRef = await db
      .collection('categories')
      .doc(category.id)
      .set(category)

    return category
  }

  remove = async (categoryID: CategoryID) => {
    log('remove', categoryID)

    const db = await this.dbPromise

    const categoryRef = db.collection(categories).doc(categoryID)

    const batch = db.batch()

    createSnapshotObservable(db.collection('transactions').where('categoryID', '==', categoryID))
      .pipe(
        first(),
        map((querySnapshot) => querySnapshot.docs.map((doc) => doc.ref)),
        tap((arrayOfRefs) => log('arrayOfRefs', arrayOfRefs)),
        concatMap((refs) => {
          log('update refs', refs)
          refs.forEach((ref) =>
            batch.update(ref, {
              categoryID: NO_CATEGORY.id,
              updated: Date.now(),
            }),
          )
          batch.delete(categoryRef)
          log('commit updates')
          return from(batch.commit())
        }),
        tap((commitResult) => log('commitResult', commitResult)),
      )
      .subscribe((v) => log('subscribe result', v), (err) => log('error', err), () => log('complete'))
    return true
  }
}
