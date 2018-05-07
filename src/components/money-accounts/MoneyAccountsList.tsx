import * as React from 'react'
import { connectDB, ConnectedContainer } from '~/db/DatabaseContext'
import { MoneyAccountsListItem } from './MoneyAccountsListItem'

interface Props {
  moneyAccounts: MoneyAccount[]
  deleteMoneyAccount: (id: MoneyAccountID) => Promise<boolean>
}
export const MoneyAccountsList: React.SFC<Props> = ({ moneyAccounts, deleteMoneyAccount }: Props) => {
  return moneyAccounts ? (
    <ul>
      {moneyAccounts.map((ma) => {
        return <MoneyAccountsListItem key={ma.id} account={ma} deleteMoneyAccount={deleteMoneyAccount} />
      })}
    </ul>
  ) : null
}

const withDB = connectDB(
  (db) => ({
    moneyAccounts: db.moneyAccounts.all,
  }),
  (db) => ({
    deleteMoneyAccount: (id: MoneyAccountID) => db.moneyAccounts.remove(id),
  }),
)

export const MoneyAccountsListContainer = withDB(MoneyAccountsList)
