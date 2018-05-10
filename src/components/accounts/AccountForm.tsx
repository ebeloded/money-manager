import * as React from 'react'
import { Database } from '~/db/db'
import { connectDB, ConnectedContainer } from '~/db/react-db/DatabaseContext'
import { AccountID, CreateAccount } from '~/types'
import { Log } from '~/utils/log'
import { Input, NumberInput } from '../elements/Input'

const log = Log('AccountForm')

interface Props {
  submitAccount: (newAccount: CreateAccount) => AccountID
}

interface State {
  account: CreateAccount
  isDisabled: boolean
}

export class AccountForm extends React.Component<Props, State> {
  initialState: State = {
    account: {
      name: '',
      startingBalance: 0,
    },
    isDisabled: false,
  }

  state: State = this.initialState

  onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.setState({ isDisabled: true })
    await this.props.submitAccount(this.state.account)
    this.setState(this.initialState)
  }

  onChangeName = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    const { value } = currentTarget
    this.setState(({ account }) => ({ account: { ...account, name: value } }))
  }

  onChangeStartingBalance = (startingBalance) => {
    this.setState(({ account }) => ({ account: { ...account, startingBalance } }))
  }

  render() {
    const { account } = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <fieldset disabled={this.state.isDisabled}>
          <legend>Add a new Money Account</legend>
          <Input
            type="text"
            required={true}
            value={account.name}
            onChange={this.onChangeName}
            placeholder="Account Name"
          />
          <NumberInput
            value={account.startingBalance}
            onChangeValue={this.onChangeStartingBalance}
            placeholder="Starting Balance"
            required={true}
          />
          <button type="submit">Add Account</button>
        </fieldset>
      </form>
    )
  }
}

const mapActionsToProps = (db: Database) => {
  return {
    submitAccount: (newAccount: CreateAccount) => {
      log('submitAccount', newAccount)
      return db.accounts.add(newAccount)
    },
  }
}

const withDB = connectDB(null, mapActionsToProps)

export const AccountFormContainer = withDB(AccountForm)
