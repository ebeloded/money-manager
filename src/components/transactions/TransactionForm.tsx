import React from 'react'
import { connect } from 'react-redux'
import { Observable, of } from 'rxjs'

import { Database } from 'db'
import { connectDB } from 'db/DatabaseContext'
import Debug from 'debug'
import { TransactionTypes } from '~/constants'
import { CategorySelect } from '../categories/CategorySelect'
import { DateInput, NumberInput } from '../elements/Input'
import { TransactionTypeSelect } from './TransactionTypeSelect'

const debug = Debug('App:TransactionForm')

interface Props {
  transaction?: Transaction
  allCategories: Category[]
  onSubmitTransaction: (t: NewTransaction) => Promise<TransactionID>
}

interface State {
  value: number
  date: Date
  transactionType: TransactionType
  category?: Category
}

export class TransactionForm extends React.Component<Props, State> {
  initialState: State = {
    date: new Date(),
    transactionType: TransactionTypes.EXPENSE,
    value: 0,
  }

  state: State = this.initialState

  valueInputRef = React.createRef()

  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    debug('getDerivedStateFromProps', nextProps, prevState)
    return prevState.transactionType !== TransactionTypes.TRANSFER &&
      !prevState.category &&
      Array.isArray(nextProps.allCategories)
      ? {
          category: nextProps.allCategories.find((c) => c.type === prevState.transactionType),
        }
      : null
  }

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (this.state.value && this.state.category) {
      this.props.onSubmitTransaction({
        categoryID: this.state.category.id,
        comment: '',
        transactionDate: +this.state.date,
        transactionType: this.state.transactionType,
        value: this.state.value,
      })
    }
  }

  onChangeValue = (value: number) => {
    this.setState(
      (state) =>
        state.value !== value
          ? {
              value,
            }
          : null,
    )
  }

  onChangeDate = (date: Date) => {
    if (date !== null) {
      this.setState((state) => {
        return state.date.toDateString() !== date.toDateString()
          ? {
              date,
            }
          : null
      })
    }
  }

  onChangeTransactionType = (transactionType: TransactionType) => {
    this.setState({
      transactionType,
    })
  }

  onChangeCategory = (category: Category) => {
    debug('onChangeCategory %o', category)

    this.setState({
      category,
    })
  }

  render() {
    debug('render %o', this.state)
    return !this.props.allCategories ? null : (
      <form onSubmit={this.onSubmit}>
        <TransactionTypeSelect defaultValue={this.state.transactionType} onChange={this.onChangeTransactionType} />

        <NumberInput value={this.state.value} onChangeValue={this.onChangeValue} required={true} />

        {/* <DateInput value={this.state.date} onChangeDate={this.onChangeDate} required={true} /> */}
        {this.state.transactionType !== TransactionTypes.TRANSFER && (
          // Only display Category Select for non-TRANSFER transaction types
          <CategorySelect
            categories={this.props.allCategories}
            categoryType={this.state.transactionType as CategoryType}
            defaultValue={this.state.category}
            onChange={this.onChangeCategory}
          />
        )}

        <button type="submit">Submit</button>
      </form>
    )
  }
}

const mapDataToProps = (db: Database) => {
  return {
    allCategories: db.categories.getAll(),
  }
}

const mapActionsToProps = (db: Database) => ({
  onSubmitTransaction: (t: NewTransaction) => {
    debug('onSubmitTransaction', t)
    return db.transactions.add(t)
  },
})

const withDB = connectDB(mapDataToProps, mapActionsToProps)

export const TransactionFormContainer = withDB(TransactionForm)
