import * as React from 'react'
import styled from 'react-emotion'

import { CategoryTypeEnum } from '~/constants'

const debug = require('debug')('App:CategoriesManager')

const CategoriesManagerWrap = styled('div')({})

interface Props {}

interface State {
  categoryType: CategoryType
}

export class CategoriesManager extends React.Component<Props, State> {
  state = {
    categoryType: CategoryTypeEnum.EXPENSE,
  }

  addCategory = (name: string) => {
    debug('add category %j', name)
  }

  handleChange = (categoryType: CategoryType) => {
    this.setState({ categoryType })
  }

  render() {
    return (
      <CategoriesManagerWrap>
        {/* <CategoryTypeSelect selected={this.state.categoryType} onChange={this.handleChange} />
        <CategoriesListContainer categoryType={this.state.categoryType} />
        <AddCategoryForm categoryType={this.state.categoryType} /> */}
      </CategoriesManagerWrap>
    )
  }
}
