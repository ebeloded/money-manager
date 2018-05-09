import { ThemeProvider } from 'emotion-theming'
import * as React from 'react'
import styled from 'react-emotion'
import { Route, Switch } from 'react-router-dom'

import { Log } from '~/utils/log'
import { CategoriesPage } from './categories/CategoriesPage'
import { Dashboard } from './Dashboard'
import { Header } from './Header'
import { MoneyAccountsPage } from './money-accounts/MoneyAccountsPage'

const debug = Log('App:')

const AppLayout = styled('div')({})

const defaultTheme: React.CSSProperties = {
  backgroundColor: '#333',
  color: '#ccc',
}

export class App extends React.Component {
  render() {
    debug('render App')
    return (
      <ThemeProvider theme={defaultTheme}>
        <AppLayout>
          <Header />
          <Switch>
            <Route path="/categories" component={CategoriesPage} />
            <Route path="/money-accounts" component={MoneyAccountsPage} />
            <Route exact={true} path="/" component={Dashboard} />
          </Switch>
        </AppLayout>
      </ThemeProvider>
    )
  }
}
