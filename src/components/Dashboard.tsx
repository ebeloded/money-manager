import * as React from 'react'
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
