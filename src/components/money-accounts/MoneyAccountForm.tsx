import * as React from 'react'
import { Database } from '~/db/Database'
import { connectDB, ConnectedContainer } from '~/db/DatabaseContext'
import { Log } from '~/utils/log'
import { Input, NumberInput } from '../elements/Input'
const log = Log('MoneyAccountForm')
interface Props {
  submitMoneyAccount: (newMoneyAccount: NewMoneyAccount) => MoneyAccountID
}

interface State {
  moneyAccount: NewMoneyAccount
  isDisabled: boolean
}

export class MoneyAccountForm extends React.Component<Props, State> {
  initialState: State = {
    isDisabled: false,
    moneyAccount: {
      name: '',
      startingBalance: 0,
    },
  }

  state: State = this.initialState

  onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.setState({ isDisabled: true })
    await this.props.submitMoneyAccount(this.state.moneyAccount)
    this.setState(this.initialState)
  }

  onChangeName = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    const { value } = currentTarget
    this.setState(({ moneyAccount }) => ({ moneyAccount: { ...moneyAccount, name: value } }))
  }

  onChangeStartingBalance = (startingBalance) => {
    this.setState(({ moneyAccount }) => ({ moneyAccount: { ...moneyAccount, startingBalance } }))
  }

  render() {
    const { moneyAccount } = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <fieldset disabled={this.state.isDisabled}>
          <legend>Add a new Money Account</legend>
          <Input
            type="text"
            required={true}
            value={moneyAccount.name}
            onChange={this.onChangeName}
            placeholder="Account Name"
          />
          <NumberInput
            value={moneyAccount.startingBalance}
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
    submitMoneyAccount: (newMoneyAccount: NewMoneyAccount) => {
      log('submitMoneyAccount', newMoneyAccount)
      return db.moneyAccounts.add(newMoneyAccount)
    },
  }
}

const withDB = connectDB(null, mapActionsToProps)

export const MoneyAccountFormContainer = withDB(MoneyAccountForm)
