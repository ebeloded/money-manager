import faker from 'faker'
import { Account, Category, CategoryType } from '~/types'

export const generateCategory = (type?: CategoryType): Category => ({
  categoryType: type ? type : faker.random.boolean() ? CategoryType.EXPENSE : CategoryType.INCOME,
  created: +faker.date.past(),
  id: faker.random.uuid(),
  name: faker.random.word(),
})

export const generateAccount = (): Account => ({
  balance: faker.random.number(10000),
  created: +faker.date.past(),
  id: faker.random.uuid(),
  name: faker.random.word(),
  startingBalance: faker.random.number(100),
})
