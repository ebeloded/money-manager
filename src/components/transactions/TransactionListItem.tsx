import * as React from 'react'
import { connectDB } from '~/db/react-db/DatabaseContext'
import { ExtendedTransaction, TransactionType } from '~/types'

interface Props {
  transaction: ExtendedTransaction
  onClickDelete: (txid) => Promise<boolean>
}
const ActionSection = ({ transaction }: { transaction: ExtendedTransaction }) => {
  switch (transaction.transactionType) {
    case TransactionType.EXPENSE:
      return <div>EXPENSE </div>
    case TransactionType.INCOME:
      return <div>INCOME</div>
    case TransactionType.TRANSFER:
      return <div>TRANSFER</div>
  }
}
export class TransactionListItem extends React.Component<Props> {
  handleClick = () => {
    this.props.onClickDelete(this.props.transaction.id)
  }

  shouldComponentUpdate({ transaction }: Props) {
    return this.props.transaction.updated !== transaction.updated
  }

  render() {
    // const { value, created, category } = this.props.transaction
    const { transaction } = this.props

    return (
      <tr onClick={this.handleClick}>
        <td>{new Date(transaction.created).toDateString()}</td>
        <td>
          <ActionSection transaction={transaction} />
          <div>{transaction.comment}</div>
        </td>
        <td>{transaction.value}</td>
      </tr>
    )
  }
}
