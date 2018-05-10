export enum CategoryType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  TRANSFER = 'TRANSFER',
}

export type AccountID = string
export type TransactionID = string
export type CategoryID = string
export type Timestamp = number

interface Creatable {
  created: Timestamp
}
interface Updatable {
  updated?: Timestamp
}

export interface CreateAccount {
  name: string
  startingBalance: number
}

export interface Account extends CreateAccount, Creatable, Updatable {
  id: AccountID
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
  fromAccountID?: AccountID
  toAccountID?: AccountID
}

interface NewExpenseTransaction extends TransactionBasics {
  transactionType: TransactionType.EXPENSE
  categoryID: CategoryID
  fromAccountID: AccountID
}

interface NewIncomeTransaction extends TransactionBasics {
  transactionType: TransactionType.INCOME
  categoryID: CategoryID
  toAccountID: AccountID
}

interface NewTransferTransaction extends TransactionBasics {
  transactionType: TransactionType.TRANSFER
  fromAccountID: AccountID
  toAccountID: AccountID
}

export type NewTransaction = NewExpenseTransaction | NewIncomeTransaction | NewTransferTransaction

interface SharedTransactionInterface extends Creatable, Updatable {
  id: TransactionID
  fromAccount?: Account
  category?: Category
  toAccount?: Account
}

interface CreatedExpenseTransaction extends TransactionBasics, SharedTransactionInterface {
  transactionType: TransactionType.EXPENSE
  categoryID: CategoryID
  fromAccountID: AccountID
}

interface CreatedIncomeTransaction extends TransactionBasics, SharedTransactionInterface {
  transactionType: TransactionType.INCOME
  categoryID: CategoryID
  toAccountID: AccountID
}

interface CreatedTransferTransaction extends TransactionBasics, SharedTransactionInterface {
  transactionType: TransactionType.TRANSFER
  fromAccountID: AccountID
  toAccountID: AccountID
}

export type Transaction = CreatedExpenseTransaction | CreatedIncomeTransaction | CreatedTransferTransaction

interface ExpenseTransaction extends CreatedExpenseTransaction {
  fromAccount: Account
  category: Category
}

interface IncomeTransaction extends CreatedIncomeTransaction {
  toAccount: Account
  category: Category
}

interface TransferTransaction extends CreatedTransferTransaction {
  fromAccount: Account
  toAccount: Account
}

export type ExtendedTransaction = ExpenseTransaction | IncomeTransaction | TransferTransaction
