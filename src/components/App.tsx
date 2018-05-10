import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Log } from '~/utils/log'
import { MoneyAccountsPage } from './accounts/AccountsPage'
import { CategoriesPage } from './categories/CategoriesPage'
import { Dashboard } from './Dashboard'
import { Header } from './Header'

const log = Log('App:')

export class App extends React.Component {
  render() {
    log('Render')
    return (
      <div>
        {/* <Header /> */}
        <Switch>
          {/* <Route path="/categories" component={CategoriesPage} />
          <Route path="/money-accounts" component={MoneyAccountsPage} /> */}
          <Route exact={true} path="/" component={Dashboard} />
        </Switch>
      </div>
    )
  }
}
