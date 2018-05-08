import * as React from 'react'
import { combineLatest } from 'rxjs'
import { withLatestFrom } from 'rxjs/operators'
import { NO_CATEGORY } from '~/constants'
import { connectDB } from '~/db/react-db/DatabaseContext'
import { Log } from '~/utils/log'
import { TransactionListItem } from './TransactionListItem'

const log = Log('TransactionsList')

interface Props {
  transactions: Transaction[]
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

const withDB = connectDB(
  (db) => ({
    transactions: combineLatest(db.transactions.all(), db.categories.all(), (transactions, categories) => {
      const categoriesMap = [...categories, NO_CATEGORY].reduce((m, cat) => ({ [cat.id]: cat, ...m }), {})

      log('combine latest', categoriesMap)

      return transactions.map((t) => ({
        category: categoriesMap[t.categoryID] || NO_CATEGORY,
        ...t,
      }))
    }),
  }),
  (db) => ({
    deleteTransaction: (txid: TransactionID) => db.transactions.remove(txid),
  }),
)

export const TransactionsListContainer = withDB(TransactionsList)
