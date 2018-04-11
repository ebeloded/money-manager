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

interface Transaction {
  value: number
}
