import * as React from 'react'
import { CategoryTypeEnum } from '~/constants'
import { Option, Select } from '../elements/Select'

interface CategoryTypeSelectProps {
  onChange: (categoryType: CategoryType) => void
  defaultValue?: CategoryType
}

const handleChange = (handler: (categoryType: CategoryType) => void) => (event: React.FormEvent<HTMLSelectElement>) =>
  handler(event.currentTarget.value as CategoryType)

export const CategoryTypeSelect = ({ defaultValue, onChange }: CategoryTypeSelectProps) => {
  defaultValue = defaultValue || CategoryTypeEnum.EXPENSE
  return (
    <Select defaultValue={defaultValue} onChange={handleChange(onChange)}>
      {Object.keys(CategoryTypeEnum).map((key) => (
        <Option key={key} value={CategoryTypeEnum[key]}>
          {CategoryTypeEnum[key]}
        </Option>
      ))}
    </Select>
  )
}
