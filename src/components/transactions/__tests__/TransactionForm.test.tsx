import React from 'react'
import ReactDOM from 'react-dom'
import { render, renderIntoDocument, Simulate } from 'react-testing-library'
import { generateAccount, generateCategory } from 'test-utils'
import { TransactionForm } from '~/components/transactions/TransactionForm'
import { Account, Category, CategoryType } from '~/types'

describe('TransactionForm', () => {
  xit('without categories and accounts should throw', () => {
    const accounts: Account[] = []
    const categories: Category[] = []
    const onSubmitTransaction = jest.fn()
    expect(
      render(<TransactionForm accounts={accounts} categories={categories} onSubmitTransaction={onSubmitTransaction} />),
    ).toThrow()
  })

  it('should render transaction form in default state', () => {
    const accounts: Account[] = [generateAccount()]
    const categories: Category[] = [generateCategory(CategoryType.EXPENSE), generateCategory(CategoryType.INCOME)]

    const onSubmitTransaction = jest.fn()

    const { debug, container } = render(
      <TransactionForm accounts={accounts} categories={categories} onSubmitTransaction={onSubmitTransaction} />,
    )
    debug()
  })

  it('should render appropriate controls when switched between transaction types', () => {})

  it('should fill out the form when provided with transaction', () => {})
})
