import * as React from 'react'

export const CategoryItem = (category: Category) => {
  return (
    <li>
      {category.name}
    </li>
  )
}
