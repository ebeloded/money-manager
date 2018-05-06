import Debug from 'debug'
import * as React from 'react'
import { filter, map } from 'rxjs/operators'
import { CategoryTypes, NO_CATEGORY } from '~/constants'
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
  categories: Category[]
}

export class CategorySelect extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    debug('getDerivedStateFromProps', nextProps, prevState)
    return {
      categories: [
        ...nextProps.categories.filter((c) => c.type === nextProps.categoryType),
        { ...NO_CATEGORY, type: nextProps.categoryType },
      ],
    }
  }

  handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
    debug('handleChange %O', event.currentTarget.value)

    const category = this.state.categories.find((c) => c.id === event.currentTarget.value)
    if (category) {
      this.setState({
        value: category.id,
      })

      this.props.onChange(category)
    }
  }

  render() {
    const categories = this.state.categories
    return (
      <select value={this.props.defaultValue && this.props.defaultValue.id} onChange={this.handleChange}>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    )
  }
}
