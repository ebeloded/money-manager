import * as React from 'react'
import { TransactionTypes } from '~/constants'
import { Log } from '~/utils/log'
import { Option, Select } from '../elements/Select'

interface Props {
  onChange: (transactionType: TransactionType) => void
  value: TransactionType
}

export class TransactionTypeSelect extends React.Component<Props> {
  handleChange = ({ currentTarget }: React.FormEvent<HTMLSelectElement>) => {
    const { value } = currentTarget
    this.props.onChange(value as TransactionType)
  }

  render() {
    Log('TransactionTypeSelect')('render %o', this.props)

    return (
      <div>
        <select value={this.props.value} onChange={this.handleChange}>
          {Object.keys(TransactionTypes).map((key) => (
            <option key={key} value={TransactionTypes[key]}>
              {TransactionTypes[key]}
            </option>
          ))}
        </select>
      </div>
    )
  }
}
