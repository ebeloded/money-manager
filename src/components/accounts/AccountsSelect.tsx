import * as React from 'react'
import { connectDB } from '~/db/react-db/DatabaseContext'
import { Account, AccountID } from '~/types'
import { Log } from '~/utils/log'

const log = Log('MoneyAccountsSelect')

interface Props {
  moneyAccounts: Account[]
  value: AccountID
  label: string
  onChange: (moneyAccount: AccountID) => void
}

export class AccountsSelect extends React.Component<Props> {
  handleChange = ({ currentTarget }: React.FormEvent<HTMLSelectElement>) => {
    const { value } = currentTarget
    this.props.onChange(value)
  }

  render() {
    const { moneyAccounts, label, value } = this.props
    return moneyAccounts && value ? (
      <React.Fragment>
        <label>
          {label}
          <select value={value} onChange={this.handleChange}>
            {moneyAccounts.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </React.Fragment>
    ) : null
  }
}
