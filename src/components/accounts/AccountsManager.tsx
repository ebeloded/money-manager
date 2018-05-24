import * as React from 'react'
import { AccountsListController } from '~/containers/AccountsListContainer'

export class AccountsManager extends React.Component {
  render() {
    return (
      <div>
        <AccountsListController />
        {/* <AccountFormContainer /> */}
      </div>
    )
  }
}
