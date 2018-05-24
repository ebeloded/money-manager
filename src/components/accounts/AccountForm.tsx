import { Button, Fieldset, Form, Legend, TextField } from '@elements/Form'
import * as React from 'react'
import { Database } from '~/db/db'
import { connectDB } from '~/db/react-db/DatabaseContext'
import { AccountID, CreateAccount } from '~/types'
import { Log } from '~/utils/log'

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

  onChangeName = (name) => {
    this.setState(({ account }) => ({ account: { ...account, name } }))
  }

  onChangeStartingBalance = (startingBalance) => {
    this.setState(({ account }) => ({ account: { ...account, startingBalance } }))
  }

  render() {
    const { account } = this.state
    return (
      <Form onSubmit={this.onSubmit}>
        <Fieldset disabled={this.state.isDisabled}>
          <Legend>Add a new Money Account</Legend>
          <TextField
            type="text"
            required={true}
            value={account.name}
            onChangeValue={this.onChangeName}
            label="Account Name"
            outlined={true}
          />
          <TextField
            type="number"
            value={account.startingBalance}
            onChangeValue={this.onChangeStartingBalance}
            required={true}
            label="Starting Balance"
            outlined={true}
          />
          <Button outlined={true} type="submit">
            Add Account
          </Button>
        </Fieldset>
      </Form>
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
