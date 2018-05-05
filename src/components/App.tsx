import React from 'react'
import styled from 'react-emotion'
import { Route, Switch, BrowserRouter } from 'react-router-dom'

import { CategoriesPage } from './Categories/CategoriesPage'
import { Dashboard } from './Dashboard'
import { Header } from './Header'
import { TransactionForm, TransactionFormContainer } from './Transactions/TransactionForm'
import { TransactionsList, TransactionsListContainer } from './Transactions/TransactionsList'

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
