import { connectDB } from 'db/DatabaseContext'
import React from 'react'
import { TransactionListItem, TransactionListItemContainer } from './TransactionListItem'

interface Props {
  transactions: Transaction[]
}
export class TransactionsList extends React.PureComponent<Props> {
  render() {
    const { transactions } = this.props
    return transactions ? (
      <table>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionListItemContainer key={transaction.id.toString()} transaction={transaction} />
          ))}
        </tbody>
      </table>
    ) : null
  }
}

const withDB = connectDB(
  (db) => ({
    transactions: db.transactions.list(),
  }),
  (db) => ({
    deleteTransaction: (id: TransactionID) => db.transactions.remove(id),
  }),
)

export const TransactionsListContainer = withDB(TransactionsList)
