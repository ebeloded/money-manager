import * as React from 'react'

import { CategoriesList } from './CategoriesList'

interface Props {
  categoryType: CategoryType
}

interface State {
  categories: Category[]
}

export class CategoriesListContainer extends React.Component<Props, State> {
  state: State = {
    categories: [{ name: 'bla', id: '1', type: 'EXPENSE' }],
  }

  public render() {
    const { categoryType } = this.props
    console.log(categoryType)

    return <CategoriesList categories={this.state.categories} />
  }
}
