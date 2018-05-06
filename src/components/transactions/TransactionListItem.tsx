import React from 'react'
import { connectDB } from '~/db/DatabaseContext'

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
    console.log('render transaction component')
    const { value, created } = this.props.transaction
    return (
      <tr onClick={this.handleClick}>
        <td>{value}</td>
        <td>{new Date(created).toTimeString()}</td>
      </tr>
    )
  }
}
