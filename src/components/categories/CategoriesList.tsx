import * as React from 'react'
import { CategoryItem } from './CategoryItem'

interface CategoriesListProps {
  categories: Category[]
}

export function CategoriesList({ categories }: CategoriesListProps) {
  return <ul>{categories.map(category => <CategoryItem key={category.id} {...category} />)}</ul>
}
