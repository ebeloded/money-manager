import * as React from 'react'

const renderCategoryItem = ({ name }: Category) => <li>{name}</li>

class CategoryItem extends React.PureComponent<Category> {
  render() {
    console.log('render category item')
    return renderCategoryItem(this.props)
  }
}

interface CategoriesListProps {
  categories: Category[]
}

export class CategoriesList extends React.PureComponent<CategoriesListProps> {
  render() {
    const { categories } = this.props
    return categories ? <ul>{categories.map((category) => <CategoryItem key={category.id} {...category} />)}</ul> : null
  }
}
