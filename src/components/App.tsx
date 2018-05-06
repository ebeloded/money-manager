import Debug from 'debug'
import React from 'react'
import styled from 'react-emotion'
import { Route, Switch } from 'react-router-dom'

import { CategoriesPage } from './categories/CategoriesPage'
import { Dashboard } from './Dashboard'
import { Header } from './Header'

const debug = Debug('App:')

const Main = () => (
  <Switch>
    <Route path="/categories" component={CategoriesPage} />
    <Route exact={true} path="/" component={Dashboard} />
  </Switch>
)

const AppLayout = styled('div')({
  // backgroundColor: '#333',
})

export class App extends React.Component {
  render() {
    debug('render App')
    return (
      <AppLayout>
        <Header />
        <Main />
      </AppLayout>
    )
  }
}
