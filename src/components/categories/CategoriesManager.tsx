import * as React from 'react'
import styled from 'react-emotion'
import { filter } from 'rxjs/operators'

import { CategoriesList } from './CategoriesList'
import { CategoryForm } from './CategoryForm'
import { CategoryTypeSelect } from './CategoryTypeSelect'

import { CategoryTypes } from '~/constants'
import { connectDB } from '~/db/DatabaseContext'

const debug = require('debug')('App:CategoriesManager')

const CategoriesManagerWrap = styled('div')({})

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
    categoryType: CategoryTypes.EXPENSE,
  }

  onCategoryTypeChange = (categoryType: CategoryType) => {
    this.setState({ categoryType })
  }

  getCategories = () => {
    return this.props.categories ? this.props.categories.filter((c) => c.type === this.state.categoryType) : []
  }

  render() {
    return (
      <CategoriesManagerWrap>
        <CategoryTypeSelect defaultValue={this.state.categoryType} onChange={this.onCategoryTypeChange} />
        <CategoriesList categories={this.getCategories()} onDeleteCategory={this.props.onDeleteCategory} />
        <CategoryForm type={this.state.categoryType} onSubmit={this.props.onSubmitCategory} />
      </CategoriesManagerWrap>
    )
  }
}

const withDB = connectDB(
  (db) => ({
    categories: db.categories.all(),
  }),
  (db) => ({
    onDeleteCategory: (cid: CategoryID) => db.categories.remove(cid),
    onSubmitCategory: (c: NewCategory) => db.categories.add(c),
  }),
)

export const CategoriesManagerContainer = withDB(CategoriesManager)
