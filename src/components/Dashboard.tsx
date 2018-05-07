import * as React from 'react'
import styled from 'react-emotion'

import { CategoriesManagerContainer } from './categories/CategoriesManager'
import { MoneyAccountsManager } from './money-accounts/MoneyAccountsManager'
import { TransactionsManager } from './transactions/TransactionsManager'

const DashboardLayout = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 2fr 1fr',
})

export class Dashboard extends React.Component {
  render() {
    return (
      <DashboardLayout>
        <MoneyAccountsManager />
        <TransactionsManager />
        <CategoriesManagerContainer />
      </DashboardLayout>
    )
  }
}
