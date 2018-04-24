import * as React from 'react'
import styled from 'react-emotion'

import { CategoryTypeEnum } from '@constants'
import { CategoriesListContainer } from './CategoriesListContainer'
import { AddCategoryForm } from './EditCategoryForm'

const debug = require('debug')('App:CategoriesManager')

interface Props {}

interface State {
  categoryType: CategoryType
}

const Select = styled('select')``

const CategoriesManagerWrap = styled('div')``

interface CategoryTypeSelectProps {
  onChange: (categoryType: CategoryType) => void
  selected: CategoryType
}

const handleChange = (handler: (categoryType: CategoryType) => void) => (event: React.FormEvent<HTMLSelectElement>) =>
  handler(event.currentTarget.value as CategoryType)

const CategoryTypeSelect = ({ selected, onChange }: CategoryTypeSelectProps) => {
  return (
    <Select value={selected} onChange={handleChange(onChange)}>
      {Object.keys(CategoryTypeEnum).map(key => (
        <option key={key} value={CategoryTypeEnum[key]}>
          {CategoryTypeEnum[key]}
        </option>
      ))}
    </Select>
  )
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
        <CategoryTypeSelect selected={this.state.categoryType} onChange={this.handleChange} />
        <CategoriesListContainer categoryType={this.state.categoryType} />
        <AddCategoryForm categoryType={this.state.categoryType} />
      </CategoriesManagerWrap>
    )
  }
}
