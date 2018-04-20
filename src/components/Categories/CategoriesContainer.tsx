import { CategoryType } from '@constants'
import * as React from 'react'

interface CategoriesContainerProps {
  value?: CategoryType
}

interface CategoriesContainerState {
  value: CategoryType
}

export class CategoriesListContainer extends React.Component<
  CategoriesContainerProps,
  CategoriesContainerState
> {
  constructor(props: CategoriesContainerProps) {
    super(props)
    this.state = {
      value: this.props.value || CategoryType.EXPENSE,
    }
  }

  public render() {
    return <div>Categories Container</div>
  }
}
