import React from 'react'
import styled from 'react-emotion'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { CategoriesPage } from './categories/CategoriesPage'
import { Dashboard } from './Dashboard'
import { Header } from './Header'

const Main = () => (
  <Switch>
    <Route path="/categories" component={CategoriesPage} />
    <Route exact={true} path="/" component={Dashboard} />
  </Switch>
)

const AppLayout = styled('div')({
  backgroundColor: '#333',
})

export class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    )
  }
}
