type MoneyAccountID = string
type TransactionID = string
type CategoryID = string
type INCOME = 'INCOME'
type EXPENSE = 'EXPENSE'
type TRANSFER = 'TRANSFER'
type CategoryType = INCOME | EXPENSE
type TransactionType = CategoryType | TRANSFER
type Timestamp = number

interface DatabaseSettings {
  enablePersistence: boolean
}

interface Creatable {
  created: Timestamp
}
interface Updatable {
  updated?: Timestamp
}

interface NewMoneyAccount {
  name: string
  startingBalance: number
}

interface MoneyAccount extends NewMoneyAccount, Creatable, Updatable {
  id: MoneyAccountID
  balance: number
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

interface Category extends NewCategory, Creatable, Updatable {
  id: CategoryID
}

interface NewTransaction {
  value: number
  transactionDate: Timestamp
  categoryID: CategoryID
  transactionType: TransactionType
  comment: string
  // isPlanned: boolean,
  // fromAccount
  // toAccount
  // author
}
interface Transaction extends NewTransaction, Creatable, Updatable {
  id: TransactionID
  category: Category
}
