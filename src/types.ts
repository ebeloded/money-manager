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

interface TransactionBasics {
  value: number
  transactionDate: Timestamp
  comment: string
  isPlanned: boolean
  transactionType: TransactionType
}

interface NewExpenseTransaction extends TransactionBasics {
  transactionType: TransactionType.EXPENSE
  categoryID: CategoryID
  fromAccountID: MoneyAccountID
}

interface NewIncomeTransaction extends TransactionBasics {
  transactionType: TransactionType.INCOME
  categoryID: CategoryID
  toAccountID: MoneyAccountID
}

interface NewTransferTransaction extends TransactionBasics {
  transactionType: TransactionType.TRANSFER
  fromAccountID: MoneyAccountID
  toAccountID: MoneyAccountID
}

export type NewTransaction = NewExpenseTransaction | NewIncomeTransaction | NewTransferTransaction

interface CreatedTransaction extends TransactionBasics, Creatable, Updatable {
  id: TransactionID
}

export interface ExpenseTransaction extends CreatedTransaction {
  transactionType: TransactionType.EXPENSE
  fromAccount: MoneyAccount
  category: Category
}

export interface IncomeTransaction extends CreatedTransaction {
  transactionType: TransactionType.INCOME
  toAccount: MoneyAccount
  category: Category
}

export interface TransferTransaction extends CreatedTransaction {
  transactionType: TransactionType.TRANSFER
  fromAccount: MoneyAccount
  toAccount: MoneyAccount
}

export type ExtendedTransaction = ExpenseTransaction | IncomeTransaction | TransferTransaction
