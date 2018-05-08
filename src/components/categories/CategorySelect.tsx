import { filter } from 'lodash'
import * as React from 'react'
import { map } from 'rxjs/operators'
import { CategoryTypes, NO_CATEGORY } from '~/constants'
import { connectDB } from '~/db/react-db/DatabaseContext'
import { Log } from '~/utils/log'

const debug = Log('App:CategorySelect')

interface Props {
  categories: Category[]
  value: CategoryID
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
    const { categories, categoryType } = this.props
    const categoriesOfType = categories.filter((c) => c.type === categoryType)
    return (
      <select value={this.props.value} onChange={this.handleChange}>
        {categoriesOfType.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    )
  }
}
