import React from 'react'
import { CategoriesManager } from './Categories/CategoriesManager'
import { AddTransactionForm } from './Transactions/AddTransactionForm'
import { TransactionsListContainer } from './Transactions/TransactionsListContainer'
import { Database } from 'db/Database'
import { DatabaseProvider } from 'db/DatabaseContext'

export const App = () => {
  return (
    <div>
      {/* <AddTransactionForm />
      <TransactionsListContainer /> */}
      <CategoriesManager />
    </div>
  )
}

export default App
