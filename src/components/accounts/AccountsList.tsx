import * as React from 'react'
import styled from 'react-emotion'
import { connectDB, ConnectedContainer } from '~/db/react-db/DatabaseContext'
import { Account, AccountID } from '~/types'
import { AccountsListItem } from './AccountsListItem'

const AccountsGroupContainer = styled('div')`
  padding: 15px;
`

const TotalBalance = styled('div')`
  font-size: 15px;
  color: #999;
  padding: 10px 0;
  border-bottom: 1px dashed #999;
`

const AccountsListWrap = styled('div')``

interface Props {
  accounts?: Account[]
  deleteAccount: (id: AccountID) => Promise<boolean>
}
export const AccountsList: React.SFC<Props> = ({ accounts, deleteAccount }: Props) => {
  if (!accounts) {
    return null
  }
  const totalBalance = accounts.reduce((sum, { balance }) => sum + balance, 0)
  return (
    <AccountsGroupContainer>
      <TotalBalance>Total Balance: {totalBalance}</TotalBalance>
      <AccountsListWrap>
        {accounts.map((ma) => <AccountsListItem key={ma.id} account={ma} deleteAccount={deleteAccount} />)}
      </AccountsListWrap>
    </AccountsGroupContainer>
  )
}

const withDB = connectDB(
  (db) => ({
    accounts: db.accounts.all,
  }),
  (db) => ({
    deleteAccount: (id: AccountID) => db.accounts.remove(id),
  }),
)

export const AccountsListController = withDB(AccountsList)
