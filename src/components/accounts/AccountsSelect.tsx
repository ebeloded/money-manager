import * as React from 'react'
import { connectDB } from '~/db/react-db/DatabaseContext'
import { Account, AccountID } from '~/types'
import { Log } from '~/utils/log'

const log = Log('AccountsSelect')

interface Props {
  accounts: Account[]
  value: AccountID
  label: string
  onChange: (account: AccountID) => void
}

export class AccountsSelect extends React.Component<Props> {
  handleChange = ({ currentTarget }: React.FormEvent<HTMLSelectElement>) => {
    const { value } = currentTarget
    this.props.onChange(value)
  }

  render() {
    const { accounts, label, value } = this.props
    return accounts && value ? (
      <React.Fragment>
        <label>
          {label}
          <select value={value} onChange={this.handleChange}>
            {accounts.map(({ id, name }) => (
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
