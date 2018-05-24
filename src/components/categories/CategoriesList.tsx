import React from 'react'

import { List, ListItem, ListItemText } from '@elements/Layout'
import { Category, CategoryID } from '~/types'

interface CategoriesListProps {
  categories: Category[]
  onDeleteCategory: (cid: CategoryID) => Promise<boolean>
}

export class CategoriesList extends React.PureComponent<CategoriesListProps> {
  handleClick = (categoryID) => () => this.props.onDeleteCategory(categoryID)

  render() {
    const { categories } = this.props
    return categories ? (
      <List>
        {categories.map((category) => (
          <ListItem key={category.id} onClick={this.handleClick(category.id)}>
            <ListItemText>{category.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    ) : null
  }
}
