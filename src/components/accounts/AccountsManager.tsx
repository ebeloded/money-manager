import * as React from 'react'
import { AccountFormContainer } from './AccountForm'
import { AccountsListController } from './AccountsList'

export class AccountsManager extends React.Component {
  render() {
    return (
      <div>
        <AccountsListController />
        <AccountFormContainer />
      </div>
    )
  }
}
