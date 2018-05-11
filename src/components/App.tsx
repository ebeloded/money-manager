import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { css, injectGlobal } from 'emotion'
import { ThemeProvider } from 'emotion-theming'
import { Log } from '~/utils/log'
import { AccountsPage } from './accounts/AccountsPage'
import { CategoriesPage } from './categories/CategoriesPage'
import { Dashboard } from './Dashboard'
import { Header } from './Header'

const log = Log('App:')

const defaultTheme = {
  backgroundColor: '#333',
  color: '#fff',
}

export class App extends React.Component {
  render() {
    log('Render')
    return (
      <ThemeProvider theme={defaultTheme}>
        {/* <Header /> */}
        <Switch>
          {/* <Route path="/categories" component={CategoriesPage} />
          <Route path="/money-accounts" component={AccountsPage} /> */}
          <Route exact={true} path="/" component={Dashboard} />
        </Switch>
      </ThemeProvider>
    )
  }
}

const global = css`
  body {
    margin: 0;
    font-size: 14px;
  }

  html {
    background-color: ${defaultTheme.backgroundColor};
    color: ${defaultTheme.color};
    font-family: 'Fira Mono', 'Roboto Mono';
  }
`

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  ${global}
`
