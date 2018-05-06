const EXPENSE: CategoryType = 'EXPENSE'
const INCOME: CategoryType = 'INCOME'

export const CategoryTypes: { [key in CategoryType]: CategoryType } = {
  EXPENSE,
  INCOME,
}

const TRANSFER: TransactionType = 'TRANSFER'

export const TransactionTypes: { [key in TransactionType]: TransactionType } = {
  EXPENSE,
  INCOME,
  TRANSFER,
}
