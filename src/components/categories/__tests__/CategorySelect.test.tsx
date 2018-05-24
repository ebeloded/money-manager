import * as faker from 'faker'
import React from 'react'
import { render } from 'react-testing-library'
import { Category, CategoryType } from '~/types'
import { CategorySelect } from '../CategorySelect'

const generateCategory = (): Category => ({
  categoryType: faker.random.boolean() ? CategoryType.EXPENSE : CategoryType.INCOME,
  created: +faker.date.past(),
  id: faker.random.uuid(),
  name: faker.random.word(),
})
const categories = []
describe('CategorySelect', () => {
  it('can render select', () => {
    const onChange = jest.fn()
    const { debug, getByLabelText, getByTestId } = render(
      <CategorySelect
        categories={categories}
        categoryType={CategoryType.EXPENSE}
        onChange={onChange}
        selectedCategoryID="asfd"
      />,
    )

    debug()
  })
})
