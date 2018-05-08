import * as React from 'react'
import { MoneyAccount, MoneyAccountID } from '~/types'

interface P {
  account: MoneyAccount
  deleteMoneyAccount: (id: MoneyAccountID) => Promise<boolean>
}

export class MoneyAccountsListItem extends React.Component<P> {
  shouldComponentUpdate(nextProps: P) {
    return nextProps.account.updated !== this.props.account.updated
  }

  handleClick = () => {
    this.props.deleteMoneyAccount(this.props.account.id)
  }

  render() {
    const { name, balance } = this.props.account
    return (
      <li onClick={this.handleClick}>
        {name}:{balance}
      </li>
    )
  }
}
