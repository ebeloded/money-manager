import * as React from 'react'

import { CategoriesList } from './CategoriesList'
import { CategoryTypeSelect } from './CategoryTypeSelect'

import { connectDB } from '~/db/react-db/DatabaseContext'
import { Category, CategoryID, CategoryType, NewCategory } from '~/types'

interface Props {
  onSubmitCategory: (category: NewCategory) => Promise<CategoryID>
  onDeleteCategory: (cid: CategoryID) => Promise<boolean>
  categories?: Category[]
}

interface State {
  categoryType: CategoryType
}

export class CategoriesManager extends React.Component<Props, State> {
  state = {
    categoryType: CategoryType.EXPENSE,
  }

  onCategoryTypeChange = (categoryType: CategoryType) => {
    this.setState({ categoryType })
  }

  getCategories = () => {
    return this.props.categories ? this.props.categories.filter((c) => c.categoryType === this.state.categoryType) : []
  }

  render() {
    return (
      <div>
        <CategoryTypeSelect defaultValue={this.state.categoryType} onChange={this.onCategoryTypeChange} />
        <CategoriesList categories={this.getCategories()} onDeleteCategory={this.props.onDeleteCategory} />
        {/* <CategoryForm type={this.state.categoryType} onSubmit={this.props.onSubmitCategory} /> */}
      </div>
    )
  }
}

const withDB = connectDB(
  (db) => ({
    categories: db.categories.all,
  }),
  (db) => ({
    onDeleteCategory: (cid: CategoryID) => db.categories.remove(cid),
    onSubmitCategory: (c: NewCategory) => db.categories.add(c),
  }),
)

export const CategoriesManagerContainer = withDB(CategoriesManager)
