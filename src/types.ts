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
  categoryType: CategoryType
}

export interface Category extends NewCategory, Creatable, Updatable {
  id: CategoryID
}

export interface TransactionBasics {
  value: number
  transactionDate: Timestamp
  comment: string
  isPlanned: boolean

  transactionType?: TransactionType
  categoryID?: CategoryID
  fromAccountID?: MoneyAccountID
  toAccountID?: MoneyAccountID
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

interface SharedTransactionInterface extends Creatable, Updatable {
  id: TransactionID
  fromAccount?: MoneyAccount
  category?: Category
  toAccount?: MoneyAccount
}

interface CreatedExpenseTransaction extends TransactionBasics, SharedTransactionInterface {
  transactionType: TransactionType.EXPENSE
  categoryID: CategoryID
  fromAccountID: MoneyAccountID
}

interface CreatedIncomeTransaction extends TransactionBasics, SharedTransactionInterface {
  transactionType: TransactionType.INCOME
  categoryID: CategoryID
  toAccountID: MoneyAccountID
}

interface CreatedTransferTransaction extends TransactionBasics, SharedTransactionInterface {
  transactionType: TransactionType.TRANSFER
  fromAccountID: MoneyAccountID
  toAccountID: MoneyAccountID
}

export type CreatedTransaction = CreatedExpenseTransaction | CreatedIncomeTransaction | CreatedTransferTransaction

interface ExpenseTransaction extends CreatedExpenseTransaction {
  fromAccount: MoneyAccount
  category: Category
}

interface IncomeTransaction extends CreatedIncomeTransaction {
  toAccount: MoneyAccount
  category: Category
}

interface TransferTransaction extends CreatedTransferTransaction {
  fromAccount: MoneyAccount
  toAccount: MoneyAccount
}

export type Transaction = ExpenseTransaction | IncomeTransaction | TransferTransaction
