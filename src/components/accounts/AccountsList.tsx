import { List } from '@elements/Layout'
import * as React from 'react'
import styled from 'react-emotion'
import { connectDB, ConnectedContainer } from '~/db/react-db/DatabaseContext'
import { Account, AccountID } from '~/types'
import { AccountsListItem } from './AccountsListItem'

const AccountsGroupContainer = styled('div')``

const TotalBalance = styled('div')``

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
      <List>{accounts.map((ma) => <AccountsListItem key={ma.id} account={ma} deleteAccount={deleteAccount} />)}</List>
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
