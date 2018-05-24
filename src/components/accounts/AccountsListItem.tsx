import { ListItem, ListItemMeta, ListItemText } from '@elements/Layout'
import * as React from 'react'
import { Account, AccountID } from '~/types'
import { Log } from '~/utils/log'

const log = Log('AccountsListItem')

interface P {
  account: Account
  deleteAccount: (id: AccountID) => Promise<boolean>
}

export class AccountsListItem extends React.Component<P> {
  shouldComponentUpdate(nextProps: P) {
    return nextProps.account.updated !== this.props.account.updated
  }

  handleClick = () => {
    log('handle click')
    this.props.deleteAccount(this.props.account.id)
  }

  render() {
    const { name, balance } = this.props.account
    return (
      <ListItem onClick={this.handleClick}>
        <ListItemText>{name}</ListItemText>
        <ListItemMeta>{balance}</ListItemMeta>
      </ListItem>
    )
  }
}
