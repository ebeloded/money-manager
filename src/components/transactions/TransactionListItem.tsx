import React from 'react'
import { connectDB } from '~/db/DatabaseContext'

interface Props {
  transaction: Transaction
  deleteTransaction: (txid) => Promise<boolean>
}
export class TransactionListItem extends React.PureComponent<Props> {
  handleClick = () => {
    this.props.deleteTransaction(this.props.transaction.id)
  }

  render() {
    const { value, created } = this.props.transaction
    return (
      <tr onClick={this.handleClick}>
        <td>{value}</td>
        <td>{new Date(created).toTimeString()}</td>
      </tr>
    )
  }
}

export const TransactionListItemContainer = connectDB(null, (db, ownProps) => ({
  deleteTransaction: () => db.transactions.remove(ownProps.transaction.id),
}))(TransactionListItem)
