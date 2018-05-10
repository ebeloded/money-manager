import * as React from 'react'
import styled from 'react-emotion'
import { connectDB, ConnectedContainer } from '~/db/react-db/DatabaseContext'
import { Account, AccountID } from '~/types'
import { MoneyAccountsListItem } from './AccountsListItem'

const AccountsGroupContainer = styled('div')`
  padding: 15px;
`

const TotalBalance = styled('div')`
  font-size: 15px;
  color: #999;
  padding: 10px 0;
  border-bottom: 1px dashed #999;
`

const AccountsListContainer = styled('div')``

interface Props {
  moneyAccounts?: Account[]
  deleteMoneyAccount: (id: AccountID) => Promise<boolean>
}
export const MoneyAccountsList: React.SFC<Props> = ({ moneyAccounts, deleteMoneyAccount }: Props) => {
  if (!moneyAccounts) {
    return null
  }
  const totalBalance = moneyAccounts.reduce((sum, { balance }) => sum + balance, 0)
  return (
    <AccountsGroupContainer>
      <TotalBalance>Total Balance: {totalBalance}</TotalBalance>
      <AccountsListContainer>
        {moneyAccounts.map((ma) => {
          return <MoneyAccountsListItem key={ma.id} account={ma} deleteMoneyAccount={deleteMoneyAccount} />
        })}
      </AccountsListContainer>
    </AccountsGroupContainer>
  )
}

const withDB = connectDB(
  (db) => ({
    moneyAccounts: db.moneyAccounts.all,
  }),
  (db) => ({
    deleteMoneyAccount: (id: AccountID) => db.moneyAccounts.remove(id),
  }),
)

export const MoneyAccountsListContainer = withDB(MoneyAccountsList)
