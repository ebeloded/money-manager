import * as React from 'react'
import { ExtendedTransaction, TransactionType } from '~/types'
import { Log } from '~/utils/log'

const log = Log('TransactionListItem')
interface Props {
  transaction: ExtendedTransaction
  onClickDelete: (txid) => Promise<boolean>
}
const ActionSection = ({ transaction }: { transaction: ExtendedTransaction }) => {
  switch (transaction.transactionType) {
    case TransactionType.EXPENSE:
      return (
        <div>
          EXPENSE: {transaction.fromAccount.name} => {transaction.category.name}
        </div>
      )
    case TransactionType.INCOME:
      return (
        <div>
          INCOME: {transaction.category.name} => {transaction.toAccount.name}
        </div>
      )
    case TransactionType.TRANSFER:
      return (
        <div>
          TRANSFER: {transaction.fromAccount.name} => {transaction.toAccount.name}
        </div>
      )
  }
}
export class TransactionListItem extends React.Component<Props> {
  handleClick = () => {
    log('handleClick')
    this.props.onClickDelete(this.props.transaction.id)
  }

  shouldComponentUpdate({ transaction }: Props) {
    return this.props.transaction.updated !== transaction.updated
  }

  render() {
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
