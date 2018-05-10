import { from, Observable } from 'rxjs'
import { concatMap, first, map, shareReplay, take, tap } from 'rxjs/operators'
import { FirestoreFacade } from '~/db/FirestoreFacade'
import { Category, CategoryID, CategoryType, NewCategory } from '~/types'
import { Log } from '~/utils/log'
import { Database } from './db'

const log = Log('db.categories')

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
  all = this.init.firestore.pipe(
    concatMap((firestore) =>
      firestore
        .createSnapshotObservable(firestore.categories)
        .pipe(
          map((querySnapshot) => firestore.querySnapshotToDocumentArray<Category>(querySnapshot)),
          map((cats) => [...cats, NO_CATEGORY_EXPENSE, NO_CATEGORY_INCOME]),
        )
        .pipe(shareReplay()),
    ),
  )

  constructor(private init: { db: Database; firestore: Observable<FirestoreFacade> }) {}

  add = async (newCategory: NewCategory) => {
    const id = Database.generateID()
    const category: Category = {
      created: Date.now(),
      id,
      ...newCategory,
    }

    log('add', category)

    this.init.firestore
      .pipe(
        concatMap((firestore) => {
          return firestore.categories.doc(id).set(category)
        }),
      )
      .subscribe({
        complete: () => log('complete add category'),
        next: (v) => log('next add category', v),
      })

    return category
  }

  remove = async (categoryID: CategoryID) => {
    log('remove', categoryID)

    this.init.firestore
      .pipe(
        concatMap((firestore) => {
          const batch = firestore.batch()

          return firestore.createSnapshotObservable(firestore.transactions.where('categoryID', '==', categoryID)).pipe(
            first(), // make sure we don't stay subscribed to transactions
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
              batch.delete(firestore.categories.doc(categoryID))
              log('commit updates')
              return from(batch.commit())
            }),
            tap((commitResult) => log('commitResult', commitResult)),
          )
        }),
      )
      .subscribe({
        complete: () => log('complete add money account'),
        error: (err) => log('error', err),
        next: (v) => log('next add money account', v),
      })
    return true
  }
}
