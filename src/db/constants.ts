import { Category, CategoryType } from '~/types'

export const NO_CATEGORY = {
  created: 0,
  id: 'NO_CATEGORY_ID',
  name: 'No Category',
}

export const NO_CATEGORY_EXPENSE: Category = {
  ...NO_CATEGORY,
  type: CategoryType.EXPENSE,
}
export const NO_CATEGORY_INCOME: Category = {
  ...NO_CATEGORY,
  type: CategoryType.INCOME,
}
