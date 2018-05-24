import { CategoriesManager } from '~/components/categories/CategoriesManager'
import { connectDB } from '~/db/react-db/DatabaseContext'
import { CategoryID, NewCategory } from '~/types'

const withDB = connectDB(
  (db) => ({
    categories: db.categories.all,
  }),
  (db) => ({
    onDeleteCategory: (cid: CategoryID) => db.categories.remove(cid),
    onSubmitCategory: (c: NewCategory) => db.categories.add(c),
  }),
)

export const CategoriesManagerContainer = withDB(CategoriesManager)
