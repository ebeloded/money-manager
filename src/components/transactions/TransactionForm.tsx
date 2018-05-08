import * as React from 'react'
import { connect } from 'react-redux'
import { Observable, of } from 'rxjs'

import { filter, find, first, some } from 'lodash'
import { map } from 'rxjs/operators'
import { NO_CATEGORY_EXPENSE, NO_CATEGORY_INCOME } from '~/db/constants'
import { Database } from '~/db/Database'
import { connectDB } from '~/db/react-db/DatabaseContext'
import {
  Category,
  CategoryID,
  CategoryType,
  MoneyAccount,
  MoneyAccountID,
  NewTransaction,
  Timestamp,
  TransactionID,
  TransactionType,
} from '~/types'
import { Log } from '~/utils/log'
import { CategorySelect } from '../categories/CategorySelect'
import { DateInput, NumberInput } from '../elements/Input'
import { MoneyAccountsSelect } from '../money-accounts/MoneyAccountsSelect'
import { TransactionTypeSelect } from './TransactionTypeSelect'

const log = Log('App:TransactionForm')

interface Props {
  // transaction?: Transaction
  moneyAccounts: MoneyAccount[]
  categories: Category[]
  onSubmitTransaction: (t: NewTransaction) => Promise<TransactionID>
}

type State = NewTransaction

export class TransactionForm extends React.Component<Props, State> {
  initialState = {
    comment: '',
    isPlanned: false,
    transactionDate: Date.now(),
    value: 0,
  }

  state: State = { ...this.initialState, type: TransactionType.EXPENSE }

  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    const { categories, moneyAccounts } = nextProps
    const { categoryID, fromAccountID, toAccountID } = prevState
    const type = prevState.type as string // Necessary for correct type checking
    const firstCategoryOfType = find(categories, { type: type as CategoryType })

    const result: Partial<State> | null =
      categories && moneyAccounts && firstCategoryOfType && some(moneyAccounts)
        ? {
            categoryID: categoryID || firstCategoryOfType.id,
            fromAccountID:
              (some(moneyAccounts, { id: fromAccountID }) && fromAccountID) ||
              (first(moneyAccounts) as MoneyAccount).id,
            toAccountID:
              (some(moneyAccounts, { id: toAccountID }) && toAccountID) || (first(moneyAccounts) as MoneyAccount).id,
          }
        : { categoryID: undefined, fromAccountID: undefined, toAccountID: undefined }
    log('result', result)
    return result
  }

  onChangeValue = (value: number) => {
    this.setState({ value })
  }

  onChangeDate = (transactionDate: Timestamp) => {
    this.setState({ transactionDate })
  }

  onChangeTransactionType = (type: TransactionType) => {
    this.setState({
      type,
    })
  }

  onChangeMoneyAccountFrom = (fromAccountID: MoneyAccountID) => {
    this.setState({ fromAccountID })
  }

  onChangeMoneyAccountTo = (toAccountID: MoneyAccountID) => {
    this.setState({ toAccountID })
  }

  onChangeCategory = (categoryID: CategoryID) => {
    this.setState({ categoryID })
  }

  isValid = () => {
    // TODO: Implement form validation
    return true
  }

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (this.isValid()) {
      this.props.onSubmitTransaction(this.state)
    }
  }

  render() {
    const { categoryID, fromAccountID, toAccountID, type, value, transactionDate } = this.state
    const { moneyAccounts, categories } = this.props
    return categoryID && fromAccountID && toAccountID && moneyAccounts && categories ? (
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <legend>Add new Transaction</legend>
          <TransactionTypeSelect value={type} onChange={this.onChangeTransactionType} />
          <NumberInput value={value} onChangeValue={this.onChangeValue} required={true} />

          {type !== TransactionType.INCOME &&
            fromAccountID && (
              <MoneyAccountsSelect
                label="From:"
                value={fromAccountID}
                moneyAccounts={moneyAccounts}
                onChange={this.onChangeMoneyAccountFrom}
              />
            )}
          {type !== TransactionType.EXPENSE &&
            toAccountID && (
              <MoneyAccountsSelect
                label="To:"
                value={toAccountID}
                moneyAccounts={moneyAccounts}
                onChange={this.onChangeMoneyAccountTo}
              />
            )}
          {type !== TransactionType.TRANSFER &&
            categoryID && (
              <CategorySelect
                categories={categories}
                categoryType={(type as string) as CategoryType}
                value={categoryID}
                onChange={this.onChangeCategory}
              />
            )}
          <DateInput value={transactionDate} onChangeDate={this.onChangeDate} required={true} />
          <button type="submit">Submit</button>
        </fieldset>
      </form>
    ) : null
  }
}

const mapDataToProps = (db: Database) => {
  return {
    categories: db.categories.all().pipe(map((cats) => [...cats, NO_CATEGORY_EXPENSE, NO_CATEGORY_INCOME])),
    moneyAccounts: db.moneyAccounts.all,
  }
}

const mapActionsToProps = (db: Database) => ({
  onSubmitTransaction: (t: NewTransaction) => {
    log('onSubmitTransaction', t)
    return db.transactions.add(t)
  },
})

const withDB = connectDB(mapDataToProps, mapActionsToProps)

export const TransactionFormContainer = withDB(TransactionForm)
