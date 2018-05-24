import * as React from 'react'

import { ExtendedTransaction, TransactionID } from '~/types'
import { Log } from '~/utils/log'
import { TransactionListItem } from './TransactionListItem'

const log = Log('TransactionsList')

interface Props {
  transactions: ExtendedTransaction[]
  deleteTransaction: (txid: TransactionID) => Promise<boolean>
}
export class TransactionsList extends React.PureComponent<Props> {
  render() {
    const { transactions } = this.props
    log('transactions %O', transactions)
    return transactions ? (
      <table>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionListItem
              key={transaction.id}
              transaction={transaction}
              onClickDelete={this.props.deleteTransaction}
            />
          ))}
        </tbody>
      </table>
    ) : null
  }
}
