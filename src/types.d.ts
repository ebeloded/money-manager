export enum CategoryType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  TRANSFER = 'TRANSFER',
}

export type MoneyAccountID = string
export type TransactionID = string
export type CategoryID = string
export type Timestamp = number

interface Creatable {
  created: Timestamp
}
interface Updatable {
  updated?: Timestamp
}

export interface NewMoneyAccount {
  name: string
  startingBalance: number
}

export interface MoneyAccount extends NewMoneyAccount, Creatable, Updatable {
  id: MoneyAccountID
  balance: number
}

export interface Currency {
  symbol: string
  code: string
  name: string
}

export interface NewCategory {
  name: string
  type: CategoryType
}

export interface Category extends NewCategory, Creatable, Updatable {
  id: CategoryID
}

export interface NewTransaction {
  value: number
  transactionDate: Timestamp
  comment: string
  isPlanned: boolean
  type: TransactionType
  categoryID?: CategoryID
  fromAccountID?: MoneyAccountID
  toAccountID?: MoneyAccountID
  // author
}

// interface NewExpenseTransaction extends NewTransaction {
//   transactionType: TransactionType.EXPENSE
//   categoryID: CategoryID
//   fromAccountID: MoneyAccountID
// }

// interface NewIncomeTransaction extends NewTransaction {
//   transactionType: TransactionType.INCOME
//   categoryID: CategoryID
//   toAccountID: MoneyAccountID
// }

// interface NewTransferTransaction extends NewTransaction {
//   transactionType: TransactionType.TRANSFER
//   fromAccountID: MoneyAccountID
//   toAccountID: MoneyAccountID
// }

export interface Transaction extends NewTransaction, Creatable, Updatable {
  id: TransactionID
}

interface ExpenseTransaction extends Transaction {
  transactionType: TransactionType.EXPENSE
  fromAccount: MoneyAccount
  category: Category
}

interface IncomeTransaction extends Transaction {
  transactionType: TransactionType.INCOME
  toAccount: MoneyAccount
  category: Category
}

interface TransferTransaction extends Transaction {
  transactionType: TransactionType.TRANSFER
  fromAccount: MoneyAccount
  toAccount: MoneyAccount
}

export type ExtendedTransaction = ExpenseTransaction | IncomeTransaction | TransferTransaction
