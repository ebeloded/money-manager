import * as React from 'react'
import { MoneyAccountFormContainer } from './AccountForm'
import { MoneyAccountsListContainer } from './AccountsList'

export class MoneyAccountsManager extends React.Component {
  render() {
    return (
      <div>
        <MoneyAccountsListContainer />
        <MoneyAccountFormContainer />
      </div>
    )
  }
}
