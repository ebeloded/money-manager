import * as React from 'react'
import { MoneyAccountFormContainer } from './MoneyAccountForm'
import { MoneyAccountsListContainer } from './MoneyAccountsList'

export class MoneyAccountsManager extends React.Component {
  render() {
    return (
      <div>
        <h1>Accounts:</h1>
        <MoneyAccountsListContainer />
        <MoneyAccountFormContainer />
      </div>
    )
  }
}
