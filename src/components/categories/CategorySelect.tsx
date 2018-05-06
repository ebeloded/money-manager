import Debug from 'debug'
import * as React from 'react'
import { filter, map } from 'rxjs/operators'
import { NO_CATEGORY } from '~/constants'
import { connectDB } from '~/db/DatabaseContext'

const debug = Debug('App:CategorySelect')

interface Props {
  categories: Category[]
  defaultValue?: Category
  categoryType: CategoryType
  onChange: (category: Category) => void
}
interface State {
  value: CategoryID
}

export class CategorySelect extends React.PureComponent<Props, State> {
  handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
    debug('handleChange %O', event.currentTarget.value)

    const category = this.props.categories.find((c) => c.id === event.currentTarget.value)
    if (category) {
      this.setState({
        value: category.id,
      })

      this.props.onChange(category)
    }
  }

  render() {
    const categories = [...this.props.categories.filter((c) => c.type === this.props.categoryType), NO_CATEGORY]
    debug('Render: %O', categories)
    return (
      <select defaultValue={this.props.defaultValue && this.props.defaultValue.id} onChange={this.handleChange}>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    )
  }
}
