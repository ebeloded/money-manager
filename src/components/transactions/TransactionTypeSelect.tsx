import { Option, Select } from '@elements/Form'
import * as React from 'react'
import { TransactionType } from '~/types'
import { Log } from '~/utils/log'

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
      <Select value={this.props.value} onChange={this.handleChange}>
        {Object.keys(TransactionType).map((key) => (
          <Option key={key} value={TransactionType[key]}>
            {TransactionType[key]}
          </Option>
        ))}
      </Select>
    )
  }
}
