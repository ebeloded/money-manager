import * as React from 'react'

import { CategoriesList } from './CategoriesList'
import { Database } from 'db/Database'
import { DatabaseConsumer } from 'db/DatabaseContext'
import { Subscription } from 'rxjs/Subscription'

interface Props {
  categoryType: CategoryType
}

interface State {
  allCategories: Category[]
}

class CategoriesListContainer extends React.Component<Props & { db: Database }, State> {
  state: State = {
    allCategories: [],
  }

  db = this.props.db

  private categoriesSubscription: Subscription

  componentDidMount() {
    console.log('component did mount')
    this.categoriesSubscription = this.db.categories.getAll().subscribe(allCategories => {
      this.setState({ allCategories }, () => {
        console.log('updated categories')
      })
    })
  }

  componentWillUnmount() {
    console.log('unsubscribing from categories')
    this.categoriesSubscription.unsubscribe()
  }

  public render() {
    const { categoryType } = this.props

    return (
      <div>
        <h1>{categoryType}</h1>
        <CategoriesList categories={this.state.allCategories.filter(c => c.type === this.props.categoryType)} />
      </div>
    )
  }
}

const withDB = <P extends {}>(MyComponent: React.ComponentType<P & { db: Database }>) => (props: P) => (
  <DatabaseConsumer>{(db: Database) => <MyComponent db={db} {...props} />}</DatabaseConsumer>
)

export default withDB(CategoriesListContainer)
