import * as React from 'react'
import { CategoryTypes } from '~/constants'
import { Log } from '~/utils/log'
import { Option, Select } from '../elements/Select'

const debug = Log('App:CategoryTypeSelect')

interface Props {
  onChange: (categoryType: CategoryType) => void
  defaultValue?: CategoryType
}

export class CategoryTypeSelect extends React.PureComponent<Props> {
  handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
    this.props.onChange(event.currentTarget.value as CategoryType)
  }

  render() {
    const { defaultValue = CategoryTypes.EXPENSE } = this.props

    return (
      <select defaultValue={defaultValue} onChange={this.handleChange}>
        {Object.keys(CategoryTypes).map((key) => (
          <option key={key} value={CategoryTypes[key]}>
            {CategoryTypes[key]}
          </option>
        ))}
      </select>
    )
  }
}
