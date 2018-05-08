import * as React from 'react'
import { Category, CategoryID } from '~/types'
import { CategoryListItem } from './CategoryListItem'

interface CategoriesListProps {
  categories: Category[]
  onDeleteCategory: (cid: CategoryID) => Promise<boolean>
}

export class CategoriesList extends React.PureComponent<CategoriesListProps> {
  render() {
    const { categories } = this.props
    return categories ? (
      <ul>
        {categories.map((category) => (
          <CategoryListItem key={category.id} category={category} onClickDelete={this.props.onDeleteCategory} />
        ))}
      </ul>
    ) : null
  }
}
