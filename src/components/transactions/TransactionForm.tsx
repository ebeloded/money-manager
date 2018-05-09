import * as React from 'react'
import { connect } from 'react-redux'
import { Observable, of } from 'rxjs'

import { filter, find, first, some } from 'lodash'
import { map } from 'rxjs/operators'
import { NO_CATEGORY_EXPENSE, NO_CATEGORY_INCOME } from '~/db/constants'

import { Database } from '~/db/db'
import { connectDB } from '~/db/react-db/DatabaseContext'
import {
  Category,
  CategoryID,
  CategoryType,
  MoneyAccount,
  MoneyAccountID,
  NewTransaction,
  Timestamp,
  TransactionBasics,
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

type State = NewTransaction | TransactionBasics

export class TransactionForm extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    const { categories, moneyAccounts } = nextProps
    const { categoryID, fromAccountID, toAccountID } = prevState
    const transactionType = prevState.transactionType || TransactionType.EXPENSE
    const firstCategoryOfType = getFirstCategoryOfType(categories, transactionType) // Necessary for correct type checking

    const result: Partial<State> | null =
      categories && moneyAccounts && firstCategoryOfType && some(moneyAccounts)
        ? {
            categoryID: categoryID || firstCategoryOfType.id,
            fromAccountID:
              (some(moneyAccounts, { id: fromAccountID }) && fromAccountID) ||
              (first(moneyAccounts) as MoneyAccount).id,
            toAccountID:
              (some(moneyAccounts, { id: toAccountID }) && toAccountID) || (first(moneyAccounts) as MoneyAccount).id,
            transactionType,
          }
        : { categoryID: undefined, fromAccountID: undefined, toAccountID: undefined }
    log('result', result)
    return result
  }

  initialState: State = {
    comment: '',
    isPlanned: false,
    transactionDate: Date.now(),
    value: 0,
  }

  state: State = this.initialState

  onChangeValue = (value: number) => {
    this.setState({ value })
  }

  onChangeDate = (transactionDate: Timestamp) => {
    this.setState({ transactionDate })
  }

  onChangeTransactionType = (transactionType: TransactionType) => {
    this.setState((state, props) => {
      const category = getFirstCategoryOfType(this.props.categories, transactionType)
      return {
        categoryID: category && category.id,
        transactionType,
      }
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

    if (this.state.transactionType) {
      this.props.onSubmitTransaction(this.state as NewTransaction).then(() => {
        this.setState(this.initialState)
      })
    }
  }

  render() {
    const { categoryID, fromAccountID, toAccountID, transactionType, value, transactionDate } = this.state
    const { moneyAccounts, categories } = this.props
    return categoryID && fromAccountID && toAccountID && moneyAccounts && categories && transactionType ? (
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <legend>Add new Transaction</legend>
          <TransactionTypeSelect value={transactionType} onChange={this.onChangeTransactionType} />
          <NumberInput value={value} onChangeValue={this.onChangeValue} required={true} />

          {transactionType !== TransactionType.INCOME &&
            fromAccountID && (
              <MoneyAccountsSelect
                label="From:"
                value={fromAccountID}
                moneyAccounts={moneyAccounts}
                onChange={this.onChangeMoneyAccountFrom}
              />
            )}
          {transactionType !== TransactionType.EXPENSE &&
            toAccountID && (
              <MoneyAccountsSelect
                label="To:"
                value={toAccountID}
                moneyAccounts={moneyAccounts}
                onChange={this.onChangeMoneyAccountTo}
              />
            )}
          {transactionType !== TransactionType.TRANSFER &&
            categoryID && (
              <CategorySelect
                categories={categories}
                categoryType={(transactionType as string) as CategoryType}
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

const mapDataToProps = (db) => {
  return {
    categories: db.categories.all,
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

function getFirstCategoryOfType(categories: Category[], transactionType: TransactionType) {
  return find(categories, { categoryType: (transactionType as string) as CategoryType })
}
