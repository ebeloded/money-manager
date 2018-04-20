import * as React from 'react'
import styled from 'react-emotion'

import { CategoryType } from '@constants'
import { CategoriesListContainer } from './CategoriesListContainer'

const debug = require('debug')('App:CategoriesManager')

interface Props {}

interface State {
  categoryType: CategoryType
}

const Select = styled.select`
  background: transparent;
  color: #eee;
  font-size: 1em;
  border: none;
  padding: 3px;
  border-radius: 1px;
  -webkit-appearance: none;
`

const CategoriesManagerWrap = styled.div`
  background: #333;
  padding: 10px;
  display: inline-block;
  &:before {
    content: '[';
  }
  &:after {
    content: ']';
  }
`

export class CategoriesManager extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      categoryType: CategoryType.EXPENSE,
    }
  }

  public handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
    this.setState({ categoryType: event.currentTarget.value as CategoryType })
  }

  public addCategory = (name: string) => {
    debug('add category %j', name)
  }

  public render() {
    return (
      <CategoriesManagerWrap>
        <Select onChange={this.handleChange} value={this.state.categoryType}>
          <option value={CategoryType.INCOME}>Income</option>
          <option value={CategoryType.EXPENSE}>Expense</option>
        </Select>
        <CategoriesListContainer categoryType={this.state.categoryType} />
      </CategoriesManagerWrap>
    )
  }
}
