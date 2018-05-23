import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Log } from '~/utils/log'
import { AccountsPage } from './accounts/AccountsPage'
import { CategoriesPage } from './categories/CategoriesPage'
import { Dashboard } from './Dashboard'
import { Header } from './Header'

const log = Log('App:')

export class App extends React.Component {
  render() {
    log('Render')
    return (
      <Switch>
        {/* <Route path="/categories" component={CategoriesPage} />
          <Route path="/accounts" component={AccountsPage} /> */}
        <Route exact={true} path="/" component={Dashboard} />
      </Switch>
    )
  }
}
