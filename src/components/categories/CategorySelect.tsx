import * as React from 'react'

import { Option, Select } from '@elements/Form'
import { Category, CategoryID, CategoryType } from '~/types'

interface Props {
  categories: Category[]
  selectedCategoryID: CategoryID
  categoryType: CategoryType
  onChange: (category: CategoryID) => void
}
interface State {
  categories: Category[]
}

export class CategorySelect extends React.PureComponent<Props, State> {
  handleChange = ({ currentTarget }: React.FormEvent<HTMLSelectElement>) => {
    this.props.onChange(currentTarget.value)
  }

  render() {
    const { categories, categoryType, selectedCategoryID } = this.props
    const categoriesOfType = categories.filter((c) => c.categoryType === categoryType)
    return (
      <Select
        data-testid="category-select"
        label="Category"
        box={true}
        value={selectedCategoryID}
        onChange={this.handleChange}
      >
        {categoriesOfType.map((category) => (
          <Option key={category.id} value={category.id}>
            {category.name}
          </Option>
        ))}
      </Select>
    )
  }
}
