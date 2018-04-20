import { initNonPersistentDatabase } from './__test__/test-utils'
import { Database } from './Database'
import Chance from 'chance'

const chance = new Chance()

let db: Database

beforeAll(() => {
  db = initNonPersistentDatabase()
})

it('can add transaction', async () => {
  const newTransaction = { value: chance.floating() }
  console.log('saving transction', newTransaction)
  const txid = await db.transactions.add(newTransaction)
  console.log('id of saved transaction', txid)
  const retreivedTransaction = await db.transactions.get(txid)
  console.log('retreived transaction', retreivedTransaction)

  expect(retreivedTransaction).toEqual(newTransaction)
})
