import * as React from 'react'
import { TransactionTypes } from '~/constants'
import { Option, Select } from '../elements/Select'

interface Props {
  onChange: (transactionType: TransactionType) => void
  defaultValue: TransactionType
}

export class TransactionTypeSelect extends React.PureComponent<Props> {
  handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
    this.props.onChange(event.currentTarget.value as TransactionType)
  }

  render() {
    const { defaultValue = TransactionTypes.EXPENSE } = this.props

    return (
      <select defaultValue={defaultValue} onChange={this.handleChange}>
        {Object.keys(TransactionTypes).map((key) => (
          <option key={key} value={TransactionTypes[key]}>
            {TransactionTypes[key]}
          </option>
        ))}
      </select>
    )
  }
}
