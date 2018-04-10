import * as React from 'react'
import { CategoryType } from '@constants'

interface CategoriesContainerProps {
  value?: CategoryType
}

interface CategoriesContainerState {
  value: CategoryType
}

export class CategoriesListContainer extends React.Component<CategoriesContainerProps, CategoriesContainerState> {

  constructor (props: CategoriesContainerProps) {
    super(props)
    this.state = {
      value: this.props.value || CategoryType.EXPENSE
    }

  }

  render () {
    return (
      <div>
        Categories Container
      </div>
    )
  }
}
