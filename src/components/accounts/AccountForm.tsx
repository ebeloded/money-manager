import { Button, Fieldset, Form, FormGroup, Input, Label, Legend } from '@elements/Form'
import * as React from 'react'
import { Database } from '~/db/db'
import { connectDB, ConnectedContainer } from '~/db/react-db/DatabaseContext'
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

          <FormGroup>
            <Label>Account Name:</Label>
            <Input
              type="text"
              required={true}
              value={account.name}
              onChangeValue={this.onChangeName}
              placeholder="Account Name"
            />
          </FormGroup>
          <FormGroup>
            <Label>Starting Balance:</Label>
            <Input
              value={account.startingBalance}
              onChangeValue={this.onChangeStartingBalance}
              placeholder="Starting Balance"
              required={true}
            />
          </FormGroup>
          <Button type="submit">Add Account</Button>
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
