import * as React from 'react'
import styled from 'react-emotion'

import { MoneyAccountsManager } from './accounts/AccountsManager'
import { CategoriesManagerContainer } from './categories/CategoriesManager'
import { TransactionsManager } from './transactions/TransactionsManager'

const DashboardLayout = styled('div')`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  margin: 0 auto;
  max-width: 1200px;
`

export class Dashboard extends React.Component {
  render() {
    return (
      <DashboardLayout>
        <MoneyAccountsManager />
        {/* <TransactionsManager />
        <CategoriesManagerContainer /> */}
      </DashboardLayout>
    )
  }
}
