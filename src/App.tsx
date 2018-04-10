import React from 'react'
import styled, { injectGlobal } from 'styled-components'
import { AddTransactionForm } from './components/Transactions/AddTransactionForm'
import { ListTransactionsContainer } from 'components/Transactions/ListTransactionsContainer'
import db from 'db'

const AppWrap = styled.div`
  font-family: 'Fira Mono';
`

const Title = styled.h1`
  color: #eee;
`

injectGlobal`
  html {
    background: #222;
    color:#eee;
  }
`

interface State {
  transactions: Transaction[]
}

class App extends React.Component<{}, State> {

  constructor (props: {}) {
    super(props)
    this.state = {
      transactions: []
    }
  }

  subscribeToTransactions () {
    db.transactions.getAll((transactions) => {
      this.setState({ transactions })
    })
  }

  componentDidMount () {
    this.subscribeToTransactions()
  }

  addTransaction = (transaction: Transaction) => {
    db.transactions.addTransaction(transaction)
  }

  render () {
    return (
      <AppWrap>
        <Title>Money Manager</Title>
        <AddTransactionForm onSubmit={this.addTransaction} />
        <ListTransactionsContainer transactions={this.state.transactions} />
      </AppWrap>
    )
  }
}

export default App
