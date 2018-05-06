type TransactionID = string
type CategoryID = string
type CategoryType = 'INCOME' | 'EXPENSE'
type TransactionType = CategoryType | 'TRANSFER'
type Timestamp = number

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
  created: Timestamp
  updated?: Timestamp
}

interface NewTransaction {
  value: number
  transactionDate: Timestamp
  category?: Category
  transactionType: TransactionType
  comment: string
  // fromAccount
  // toAccount
  // author
}
interface Transaction extends NewTransaction {
  id: TransactionID
  created: Timestamp
  updated?: Timestamp
}
