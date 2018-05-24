import * as React from 'react'

import { Grid, GridCell } from '@elements/Layout'
import { CategoriesManagerContainer } from '~/containers/CategoriesManagerContainer'
import { AccountsManager } from './accounts/AccountsManager'
import { TransactionsManager } from './transactions/TransactionsManager'

export class Dashboard extends React.Component {
  render() {
    return (
      <Grid>
        <GridCell span={3}>
          <AccountsManager />
        </GridCell>
        <GridCell span={6}>
          <TransactionsManager />
        </GridCell>
        <GridCell span={3}>
          <CategoriesManagerContainer />
        </GridCell>
      </Grid>
    )
  }
}
