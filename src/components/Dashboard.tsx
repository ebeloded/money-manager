import * as React from 'react'

import { CategoriesManagerContainer } from './categories/CategoriesManager'
import { TransactionFormContainer } from './transactions/TransactionForm'
import { TransactionsListContainer } from './transactions/TransactionsList'

export class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <TransactionFormContainer />
        <TransactionsListContainer />
      </div>
    )
  }
}
