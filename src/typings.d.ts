interface Currency {
  symbol: string
  code: string
  name: string
}

type CategoryType = 'INCOME' | 'EXPENSE'

interface Category {
  id?: string
  name: string
  created?: number
  type: CategoryType
}
type TransactionID = string

interface Transaction {
  id?: TransactionID
  value: number
}
