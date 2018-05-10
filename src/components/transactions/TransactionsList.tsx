import { keyBy, reduce } from 'lodash'
import * as React from 'react'
import { combineLatest } from 'rxjs'
import { withLatestFrom } from 'rxjs/operators'
import { NO_CATEGORY } from '~/db/constants'
import { connectDB } from '~/db/react-db/DatabaseContext'
import { Account, Category, ExtendedTransaction, TransactionID, TransactionType } from '~/types'
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

const withDB = connectDB(
  (db) => ({
    transactions: combineLatest(
      db.transactions.all,
      db.categories.all,
      db.moneyAccounts.all,
      (transactions, categories, moneyAccounts) => {
        const categoriesMap = keyBy(categories, 'id')
        const accountsMap = keyBy(moneyAccounts, 'id')
        log('combine latest', categoriesMap)

        return transactions.map((t): ExtendedTransaction => {
          switch (t.transactionType) {
            case TransactionType.EXPENSE:
              return {
                ...t,
                category: categoriesMap[t.categoryID],
                fromAccount: accountsMap[t.fromAccountID],
              }
            case TransactionType.INCOME:
              return {
                ...t,
                category: categoriesMap[t.categoryID],
                toAccount: accountsMap[t.toAccountID],
              }

            case TransactionType.TRANSFER:
              return {
                ...t,
                fromAccount: accountsMap[t.fromAccountID],
                toAccount: accountsMap[t.toAccountID],
              }
          }
        })
      },
    ),
  }),
  (db) => ({
    deleteTransaction: (txid: TransactionID) => db.transactions.remove(txid),
  }),
)

export const TransactionsListContainer = withDB(TransactionsList)
