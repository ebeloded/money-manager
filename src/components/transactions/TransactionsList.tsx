import React from 'react'
import { connectDB } from 'db/DatabaseContext'

interface Props {
  transactions: Transaction[]
}

class TransactionComponent extends React.PureComponent<Transaction> {
  render() {
    const { value, created } = this.props
    return (
      <tr>
        <td>{value}</td>
        <td>{new Date(created).toTimeString()}</td>
      </tr>
    )
  }
}

export class TransactionsList extends React.PureComponent<Props> {
  render() {
    const { transactions } = this.props
    return transactions ? (
      <table>
        <tbody>
          {transactions.map((transaction) => <TransactionComponent key={transaction.id.toString()} {...transaction} />)}
        </tbody>
      </table>
    ) : null
  }
}

const withDB = connectDB((db) => ({
  transactions: db.transactions.list(),
}))

export const TransactionsListContainer = withDB(TransactionsList)
