import { Option, Select } from '@elements/Form'
import * as React from 'react'
import { CategoryType } from '~/types'

interface Props {
  onChange: (categoryType: CategoryType) => void
  defaultValue?: CategoryType
}

export class CategoryTypeSelect extends React.PureComponent<Props> {
  handleChange = ({ currentTarget }: React.FormEvent<HTMLSelectElement>) => {
    this.props.onChange(currentTarget.value as CategoryType)
  }

  render() {
    const { defaultValue = CategoryType.EXPENSE } = this.props

    return (
      <Select defaultValue={defaultValue} onChange={this.handleChange}>
        {Object.keys(CategoryType).map((key) => (
          <Option key={key} value={CategoryType[key]}>
            {CategoryType[key]}
          </Option>
        ))}
      </Select>
    )
  }
}
