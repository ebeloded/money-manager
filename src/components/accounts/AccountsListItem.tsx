import * as React from 'react'
import styled, { css } from 'react-emotion'
import { Account, AccountID } from '~/types'
import { Log } from '~/utils/log'

const log = Log('AccountsListItem')

const AccountInfoGroup = styled('div')`
  display: flex;
  flex-direction: row nowrap;
  line-height: 1.5;
  justify-content: space-between;
  padding: 5px 0;
`
const Name = styled('div')``
const Balance = styled('div')``

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
    // this.props.deleteAccount(this.props.account.id)
  }

  render() {
    const { name, balance } = this.props.account
    return (
      <AccountInfoGroup onClick={this.handleClick}>
        <Name
          className={css`
            color: #fff;
          `}
        >
          {name}
        </Name>
        <Balance
          className={css`
            color: ${balance >= 0 ? '#7ED321' : '#D0021B'};
          `}
        >
          {balance}
        </Balance>
      </AccountInfoGroup>
    )
  }
}
