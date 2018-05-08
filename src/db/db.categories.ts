import { from, Observable } from 'rxjs'
import { concatMap, map, shareReplay } from 'rxjs/operators'
import { createSnapshotObservable, getID, querySnapshotToDocumentArray } from '~/db/dbutils'
import { Category, CategoryID, CategoryType, NewCategory } from '~/types'
import { Log } from '~/utils/log'
import { CategoriesAPI, Firestore } from './API'

const log = Log('Database:Categories')

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
  constructor(private dbPromise: Promise<Firestore>) {}

  add = async (newCategory: NewCategory) => {
    const category: Category = {
      created: Date.now(),
      id: getID(),
      ...newCategory,
    }

    const db = await this.dbPromise

    const categoryRef = await db.collection('categories').add(newCategory)

    return category
  }

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

  remove = async (cid: CategoryID) => {
    const db = await this.dbPromise

    // TODO: Make sure to update all transactions with this category

    await db
      .collection('categories')
      .doc(cid)
      .delete()

    return true
  }
}
