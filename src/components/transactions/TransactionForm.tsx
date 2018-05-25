import { find, first, some } from 'lodash'
import * as React from 'react'

import { Card } from '@elements/Card'
import { Button, TextField } from '@elements/Form'
import {
  Account,
  AccountID,
  Category,
  CategoryID,
  CategoryType,
  NewTransaction,
  Timestamp,
  Transaction,
  TransactionID,
  TransactionType,
  UndefinedTransaction,
} from '~/types'
import { AccountsSelect } from '../accounts/AccountsSelect'
import { CategorySelect } from '../categories/CategorySelect'
import { TransactionTypeSelect } from './TransactionTypeSelect'

import { Log } from '~/utils/log'
const log = Log('App:TransactionForm')

interface Props {
  transaction?: Transaction
  accounts: Account[]
  categories: Category[]
  onSubmitTransaction: (t: NewTransaction) => Promise<TransactionID>
}

type State = UndefinedTransaction | NewTransaction | Transaction

export class TransactionForm extends React.Component<Props, State> {
  // Executes when there is a change in the list of categories or accounts, as well as on initial load
  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    console.log('getDerivedStateFromProps')
    const { categories, accounts } = nextProps
    const { categoryID, fromAccountID, toAccountID } = prevState
    const transactionType = prevState.transactionType || TransactionType.EXPENSE
    const firstCategoryOfType = getFirstCategoryOfType(categories, transactionType) // Necessary for correct type checking

    const result: Partial<State> | null =
      categories && accounts && firstCategoryOfType && some(accounts)
        ? {
            categoryID: categoryID || firstCategoryOfType.id,
            fromAccountID: (some(accounts, { id: fromAccountID }) && fromAccountID) || (first(accounts) as Account).id,
            toAccountID: (some(accounts, { id: toAccountID }) && toAccountID) || (first(accounts) as Account).id,
            transactionType,
          }
        : null

    return result
  }

  initialState: State = {
    comment: '',
    isPlanned: false,
    transactionDate: Date.now(),
    value: 0,
  }

  // state: State = this.initialState

  constructor(props: Props) {
    super(props)
    console.log('constructor', props)
    const { transaction, categories, accounts } = props
    if (!categories || !accounts || !categories.length || !accounts.length) {
      throw new Error('Categories and Accounts must be defined')
    }
    this.state = {
      ...this.initialState,
      categoryID: getFirstCategoryOfType(props.categories, TransactionType.EXPENSE)!.id,
      fromAccountID: first(props.accounts)!.id,
      toAccountID: first(props.accounts)!.id,
      transactionType: TransactionType.EXPENSE,
    }
  }

  onChangeValue = (value: string) => {
    this.setState({ value: +value })
  }

  onChangeDate = (transactionDate: Timestamp) => {
    this.setState({ transactionDate })
  }

  onChangeTransactionType = (transactionType: TransactionType) => {
    const category = getFirstCategoryOfType(this.props.categories, transactionType)
    this.setState({
      categoryID: category && category.id,
      transactionType,
    })
  }

  onChangeAccountFrom = (fromAccountID: AccountID) => {
    this.setState({ fromAccountID })
  }

  onChangeAccountTo = (toAccountID: AccountID) => {
    this.setState({ toAccountID })
  }

  onChangeCategory = (categoryID: CategoryID) => {
    this.setState({ categoryID })
  }

  onChangeComment = (comment: string) => {
    this.setState({ comment })
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
    const { categoryID, fromAccountID, toAccountID, transactionType, value } = this.state
    // tslint:disable-next-line:no-debugger
    // debugger
    const { accounts, categories } = this.props

    return accounts && categories && transactionType ? (
      <Card>
        <form onSubmit={this.onSubmit}>
          <TransactionTypeSelect value={transactionType} onChange={this.onChangeTransactionType} />
          <TextField label="Amount" box={true} type="number" value={value} onChangeValue={this.onChangeValue} />

          {transactionType !== TransactionType.INCOME &&
            fromAccountID && (
              <AccountsSelect
                data-testid="from-account-select"
                label="From:"
                value={fromAccountID}
                accounts={accounts}
                onChange={this.onChangeAccountFrom}
              />
            )}
          {transactionType !== TransactionType.EXPENSE &&
            toAccountID && (
              <AccountsSelect
                data-testid="to-account-select"
                label="To:"
                value={toAccountID}
                accounts={accounts}
                onChange={this.onChangeAccountTo}
              />
            )}
          {transactionType !== TransactionType.TRANSFER &&
            categoryID && (
              <CategorySelect
                data-testid="category-select"
                categories={categories}
                categoryType={(transactionType as string) as CategoryType}
                selectedCategoryID={categoryID}
                onChange={this.onChangeCategory}
              />
            )}
          {/* <Input type="date" value={transactionDate} onChangeDate={this.onChangeDate} required={true} /> */}
          <TextField fullwidth={true} label="Comment" onChangeValue={this.onChangeComment} />
          <Button type="submit">Submit</Button>
        </form>
      </Card>
    ) : null
  }
}

function getFirstCategoryOfType(categories: Category[], transactionType: TransactionType) {
  return find(categories, { categoryType: (transactionType as string) as CategoryType })
}
