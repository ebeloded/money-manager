import React from 'react'
import { connect } from 'react-redux'
import { Observable, of } from 'rxjs'

import { Database } from 'db'
import { connectDB } from 'db/DatabaseContext'
import { DateInput, NumberInput } from '../elements/Input'

interface TransactionFormOwnProps {
  transaction?: Transaction
}
interface TransactionFormConnectedDataProps {
  categories: Category[]
}

interface TransactionFormConnectedActionProps {
  onSubmitTransaction: (t: NewTransaction) => Promise<TransactionID>
}

interface TransactionFormState {
  value: number
  date: Date
  // transactionType: TransactionType
  category?: Category
}

export class TransactionForm extends React.Component<
  TransactionFormConnectedDataProps & TransactionFormConnectedActionProps & TransactionFormOwnProps,
  TransactionFormState
> {
  state: TransactionFormState = {
    date: new Date(),
    value: 0,
  }

  valueInputRef = React.createRef()

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (this.state.value) {
      this.props.onSubmitTransaction({
        transactionDate: this.state.date.getTime(),
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
    console.log('on change date', date.toDateString())
    this.setState((state) => {
      return state.date.toDateString() !== date.toDateString()
        ? {
            date,
          }
        : null
    })
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        Add transaction form
        <NumberInput value={this.state.value} onChangeValue={this.onChangeValue} required={true} />
        <DateInput value={this.state.date} onChangeDate={this.onChangeDate} required={true} />
        <button type="submit">Submit</button>
      </form>
    )
  }
}

const mapDataToProps = (db: Database) => {
  return {
    categories: of([]),
  }
}

const mapActionsToProps = (db: Database) => ({
  onSubmitTransaction: (t: NewTransaction) => {
    return db.transactions.add(t)
  },
})

const withDB = connectDB(mapDataToProps, mapActionsToProps)

export const TransactionFormContainer = withDB(TransactionForm)
