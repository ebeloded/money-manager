type TransactionID = string
type CategoryID = string
type CategoryType = 'INCOME' | 'EXPENSE'

interface DatabaseSettings {
  enablePersistence: boolean
}

interface Currency {
  symbol: string
  code: string
  name: string
}

interface NewCategory {
  name: string
  type: CategoryType
}

interface Category extends NewCategory {
  id: CategoryID
}

interface Transaction {
  id?: TransactionID
  // category: Category
  value: number
}
