import * as React from 'react'
import { connectDB } from '~/db/react-db/DatabaseContext'

interface Props {
  transaction: Transaction
  onClickDelete: (txid) => Promise<boolean>
}
export class TransactionListItem extends React.Component<Props> {
  handleClick = () => {
    this.props.onClickDelete(this.props.transaction.id)
  }

  shouldComponentUpdate({ transaction }: Props) {
    return this.props.transaction.updated !== transaction.updated
  }

  render() {
    const { value, created, category } = this.props.transaction
    return (
      <tr onClick={this.handleClick}>
        <td>{value}</td>
        <td>{category.name}</td>
        <td>{new Date(created).toDateString()}</td>
      </tr>
    )
  }
}
