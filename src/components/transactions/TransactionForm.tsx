import React from 'react'
import { connect } from 'react-redux'
import { Observable, of } from 'rxjs'

import { filter, first, some } from 'lodash'
import { map } from 'rxjs/operators'
import { CategoryTypes, NO_CATEGORY_EXPENSE, NO_CATEGORY_INCOME, TransactionTypes } from '~/constants'
import { Database } from '~/db/Database'
import { connectDB } from '~/db/DatabaseContext'
import { Log } from '~/utils/log'
import { CategorySelect } from '../categories/CategorySelect'
import { DateInput, NumberInput } from '../elements/Input'
import { MoneyAccountsSelect } from '../money-accounts/MoneyAccountsSelect'
import { TransactionTypeSelect } from './TransactionTypeSelect'

const log = Log('App:TransactionForm')

interface Props {
  transaction?: Transaction
  moneyAccounts: MoneyAccount[]
  categories: Category[]
  onSubmitTransaction: (t: NewTransaction) => Promise<TransactionID>
}

interface InitialState {
  value: number
  date: Date
  isPlanned: boolean
  comment: string
  transactionType: TransactionType
  separatedCategories?: {
    INCOME: Category[]
    EXPENSE: Category[]
  }
  categoryID?: CategoryID
  fromAccountID?: MoneyAccountID
  toAccountID?: MoneyAccountID
}

interface ExpenseTransactionState extends InitialState {
  transactionType: EXPENSE
  fromAccountID: MoneyAccountID
  categoryID: CategoryID
}

interface IncomeTransactionState extends InitialState {
  transactionType: INCOME
  toAccountID: MoneyAccountID
  categoryID: CategoryID
}

interface TransferTransactionState extends InitialState {
  transactionType: TRANSFER
  fromAccountID: MoneyAccountID
  toAccountID: MoneyAccountID
}

type State = InitialState | ExpenseTransactionState | IncomeTransactionState | TransferTransactionState

export class TransactionForm extends React.Component<Props, State> {
  initialState: State = {
    comment: '',
    date: new Date(),
    isPlanned: false,
    transactionType: TransactionTypes.EXPENSE,
    value: 0,
  }

  state: State = this.initialState

  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    const { categories, moneyAccounts } = nextProps
    const { transactionType, categoryID, fromAccountID, toAccountID } = prevState
    const separatedCategories = categories && {
      EXPENSE: filter(categories, { type: CategoryTypes.EXPENSE }),
      INCOME: filter(categories, { type: CategoryTypes.INCOME }),
    }
    const result: Partial<State> | null =
      categories && moneyAccounts && separatedCategories[transactionType][0] && moneyAccounts[0]
        ? {
            categoryID:
              (some(separatedCategories[transactionType], { id: categoryID }) && categoryID) ||
              (first(separatedCategories[transactionType]) as Category).id,
            fromAccountID:
              (some(moneyAccounts, { id: fromAccountID }) && fromAccountID) ||
              (first(moneyAccounts) as MoneyAccount).id,
            separatedCategories,
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

  onChangeDate = (date: Date) => {
    this.setState({ date })
  }

  onChangeTransactionType = (transactionType: TransactionType) => {
    this.setState({
      transactionType,
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

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (this.state.value && this.state.categoryID) {
      this.props.onSubmitTransaction({
        categoryID: this.state.categoryID,
        comment: '',
        transactionDate: +this.state.date,
        transactionType: this.state.transactionType,
        value: this.state.value,
      })
    }
  }

  render() {
    const { categoryID, fromAccountID, toAccountID, separatedCategories, transactionType, value, date } = this.state
    const { moneyAccounts } = this.props
    const categories = separatedCategories && separatedCategories[transactionType]
    return categoryID && fromAccountID && toAccountID && moneyAccounts && categories ? (
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <legend>Add new Transaction</legend>
          <TransactionTypeSelect value={transactionType} onChange={this.onChangeTransactionType} />
          <NumberInput value={value} onChangeValue={this.onChangeValue} required={true} />

          {transactionType !== TransactionTypes.INCOME &&
            fromAccountID && (
              <MoneyAccountsSelect
                label="From:"
                value={fromAccountID}
                moneyAccounts={moneyAccounts}
                onChange={this.onChangeMoneyAccountFrom}
              />
            )}
          {transactionType !== TransactionTypes.EXPENSE &&
            toAccountID && (
              <MoneyAccountsSelect
                label="To:"
                value={toAccountID}
                moneyAccounts={moneyAccounts}
                onChange={this.onChangeMoneyAccountTo}
              />
            )}
          {transactionType !== TransactionTypes.TRANSFER &&
            categoryID && (
              <CategorySelect
                categories={categories}
                categoryType={transactionType as CategoryType}
                value={categoryID}
                onChange={this.onChangeCategory}
              />
            )}
          <DateInput value={date} onChangeDate={this.onChangeDate} required={true} />
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
