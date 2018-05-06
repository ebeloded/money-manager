const EXPENSE: CategoryType = 'EXPENSE'
const INCOME: CategoryType = 'INCOME'

export const CategoryTypes: { [key in CategoryType]: CategoryType } = {
  EXPENSE,
  INCOME,
}

export const NO_CATEGORY = {
  id: 'NO_CATEGORY_ID',
  name: 'No Category',
}

export const NO_CATEGORY_EXPENSE: Category = {
  ...NO_CATEGORY,
  created: 0,
  type: CategoryTypes.EXPENSE,
}
export const NO_CATEGORY_INCOME: Category = {
  ...NO_CATEGORY,
  created: 0,
  type: CategoryTypes.INCOME,
}

const TRANSFER: TransactionType = 'TRANSFER'

export const TransactionTypes: { [key in TransactionType]: TransactionType } = {
  EXPENSE,
  INCOME,
  TRANSFER,
}
