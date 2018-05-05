import * as React from 'react'
import { CategoryTypeSelect } from './CategoryTypeSelect'
import { CategoriesManagerContainer } from './CategoriesManager'

export class CategoriesPage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <CategoriesManagerContainer />
      </React.Fragment>
    )
  }
}
