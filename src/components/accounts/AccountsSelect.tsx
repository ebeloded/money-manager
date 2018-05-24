import * as React from 'react'

import { Option, Select } from '@elements/Form'
import { Account, AccountID } from '~/types'

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
      <Select box={true} value={value} onChange={this.handleChange} label={label}>
        {accounts.map(({ id, name }) => (
          <Option key={id} value={id}>
            {name}
          </Option>
        ))}
      </Select>
    ) : null
  }
}
