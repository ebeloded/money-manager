import * as React from 'react'
import { CategoryTypeSelect } from './CategoryTypeSelect'
import { CategoriesManager } from './CategoriesManager'

const log = (v) => {
  console.log(v)
}

export class CategoriesPage extends React.Component {
  render() {
    return <CategoriesManager />
  }
}
