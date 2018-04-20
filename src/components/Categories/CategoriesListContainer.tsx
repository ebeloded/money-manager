import * as React from 'react'

import { CategoryType } from '@constants'
import { CategoriesList } from './CategoriesList'

interface Props {
  categoryType: CategoryType
}

interface State {
  categories: Category[]
}

export class CategoriesListContainer extends React.Component<Props, State> {
  public state = {
    categories: [],
  }

  constructor(props: Props) {
    super(props)
  }
  public render() {
    return (
      <ul>
        <CategoriesList categories={this.state.categories} />
      </ul>
    )
  }
}
