import * as React from 'react'
import { CategoriesManagerContainer } from './CategoriesManager'
import { CategoryTypeSelect } from './CategoryTypeSelect'

export class CategoriesPage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <CategoriesManagerContainer />
      </React.Fragment>
    )
  }
}
