import { find, first, some } from 'lodash'
import * as React from 'react'

import { Card } from '@elements/Card'
import { Button, TextField } from '@elements/Form'
import { Database } from '~/db/db'
import { connectDB } from '~/db/react-db/DatabaseContext'
import {
  Account,
  AccountID,
  Category,
  CategoryID,
  CategoryType,
  NewTransaction,
  Timestamp,
  TransactionBasics,
  TransactionID,
  TransactionType,
} from '~/types'
import { Log } from '~/utils/log'
import { AccountsSelect } from '../accounts/AccountsSelect'
import { CategorySelect } from '../categories/CategorySelect'
import { TransactionTypeSelect } from './TransactionTypeSelect'

const log = Log('App:TransactionForm')

interface Props {
  // transaction?: Transaction
  accounts: Account[]
  categories: Category[]
  onSubmitTransaction: (t: NewTransaction) => Promise<TransactionID>
}

type State = NewTransaction | TransactionBasics

export class TransactionForm extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
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
      <form onSubmit={this.onSubmit}>
        <Card>
          <TransactionTypeSelect value={transactionType} onChange={this.onChangeTransactionType} />
          <TextField label="value" box={true} type="number" value={value} onChangeValue={this.onChangeValue} />

          {transactionType !== TransactionType.INCOME &&
            fromAccountID && (
              <AccountsSelect
                label="From:"
                value={fromAccountID}
                accounts={accounts}
                onChange={this.onChangeAccountFrom}
              />
            )}
          {transactionType !== TransactionType.EXPENSE &&
            toAccountID && (
              <AccountsSelect label="To:" value={toAccountID} accounts={accounts} onChange={this.onChangeAccountTo} />
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
          {/* <Input type="date" value={transactionDate} onChangeDate={this.onChangeDate} required={true} /> */}
          <TextField fullwidth={true} label="Comment" onChangeValue={this.onChangeComment} />
          <Button type="submit">Submit</Button>
        </Card>
      </form>
    ) : null
  }
}

const mapDataToProps = (db) => {
  return {
    accounts: db.accounts.all,
    categories: db.categories.all,
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
