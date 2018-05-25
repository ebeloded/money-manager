import React from 'react'
import { render } from 'react-testing-library'

import { CategoryType } from '~/types'
import { CategorySelect } from '../CategorySelect'

const categories = []
describe('CategorySelect', () => {
  it('can render select', () => {
    const onChange = jest.fn()
    const {} = render(
      <CategorySelect
        categories={categories}
        categoryType={CategoryType.EXPENSE}
        onChange={onChange}
        selectedCategoryID="asfd"
      />,
    )
  })
})
