import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Dashboard } from './Dashboard'

export class App extends React.Component {
  render() {
    return (
      <Switch>
        {/* <Route path="/categories" component={CategoriesPage} />
          <Route path="/accounts" component={AccountsPage} /> */}
        <Route exact={true} path="/" component={Dashboard} />
      </Switch>
    )
  }
}
