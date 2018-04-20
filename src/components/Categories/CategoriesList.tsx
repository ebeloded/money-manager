import * as React from 'react'
import { CategoryItem } from './CategoryItem'

interface CategoriesListProps {
  categories: Category[]
}

export class CategoriesList extends React.Component<CategoriesListProps> {
  public render() {
    return (
      <div>
        {this.props.categories.map(category => (
          <CategoryItem key={category.id} {...category} />
        ))}
      </div>
    )
  }
}
