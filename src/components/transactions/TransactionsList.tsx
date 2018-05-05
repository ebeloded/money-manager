import { connectDB } from 'db/DatabaseContext'
import React from 'react'
import { TransactionListItem } from './TransactionListItem'

interface Props {
  transactions: Transaction[]
  deleteTransaction: (txid: TransactionID) => Promise<boolean>
}
export class TransactionsList extends React.PureComponent<Props> {
  render() {
    const { transactions } = this.props
    return transactions ? (
      <table>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionListItem
              key={transaction.id.toString()}
              transaction={transaction}
              onClickDelete={this.props.deleteTransaction}
            />
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
    deleteTransaction: (txid: TransactionID) => db.transactions.remove(txid),
  }),
)

export const TransactionsListContainer = withDB(TransactionsList)
