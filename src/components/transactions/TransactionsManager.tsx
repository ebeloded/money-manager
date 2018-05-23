import * as React from 'react'

import { TransactionFormContainer } from './TransactionForm'
import { TransactionsListContainer } from './TransactionsList'

export const TransactionsManager = () => {
  return (
    <div>
      <TransactionFormContainer />
      {/* <TransactionsListContainer /> */}
    </div>
  )
}
