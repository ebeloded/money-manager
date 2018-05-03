import { connect } from 'react-redux'
import { Observable, of } from 'rxjs'
import React from 'react'

import { Input } from '../Elements'
import { connectDB } from 'db/DatabaseContext'
import { Database } from 'db'

interface TransactionFormOwnProps {
  transaction?: Transaction
}
interface TransactionFormConnectedDataProps {
  categories: Category[]
}

interface TransactionFormConnectedActionProps {
  saveTransaction: (t: Transaction) => Observable<Transaction>
}

interface TransactionFormState {
  value?: number
  category?: Category
}

export class TransactionForm extends React.Component<
  TransactionFormConnectedDataProps & TransactionFormConnectedActionProps & TransactionFormOwnProps,
  TransactionFormState
> {
  state: TransactionFormState = {}

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (typeof this.state.value === 'number') {
      const transaction: Transaction = {
        value: this.state.value,
      }
      this.props.saveTransaction(transaction)
    }
  }

  onChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ value: +event.currentTarget.value })
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        Add transaction form
        <Input value={this.state.value} onChange={this.onChange} />
      </form>
    )
  }
}

const mapDataToProps = (db: Database, ownProps: TransactionFormOwnProps) => {
  return {
    categories: of([]),
  }
}

const mapActionsToProps = (db: Database) => ({
  saveTransaction: (t: Transaction) => {
    return of(t)
  },
})

const withDB = connectDB(mapDataToProps, mapActionsToProps)

export const TransactionFormContainer = withDB(TransactionForm)
