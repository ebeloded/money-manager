import * as React from 'react'
import { TransactionTypes } from '~/constants'
import { Log } from '~/utils/log'
import { Option, Select } from '../elements/Select'

interface Props {
  onChange: (transactionType: TransactionType) => void
  defaultValue: TransactionType
}
interface State {
  value: string
}

export class TransactionTypeSelect extends React.Component<Props, State> {
  handleChange = ({ currentTarget }: React.FormEvent<HTMLSelectElement>) => {
    const { value } = currentTarget
    this.setState({ value })
    this.props.onChange(value as TransactionType)
  }

  render() {
    Log('`TransactionTypeSelect`')('render %o', this.props)
    const { defaultValue = TransactionTypes.EXPENSE } = this.props

    return (
      <div>
        <select value={defaultValue} onChange={this.handleChange}>
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
