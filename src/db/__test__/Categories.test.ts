// import chance from 'chance'
// import { initNonPersistentDatabase } from './__test__/test-utils'
// import { Database } from './Database'

// let db: Database
// const c = new chance()

// xdescribe('categories test', () => {
//   beforeAll(() => {
//     db = initNonPersistentDatabase()
//   })

//   it('can create a category', async () => {
//     const newCategory: NewCategory = {
//       name: c.sentence({ words: 2 }),
//       type: c.bool() ? 'EXPENSE' : 'INCOME',
//     }
//     const savedCategory = await db.categories.add(newCategory)

//     expect(savedCategory.id).toBeDefined()
//     expect(savedCategory.name).toEqual(newCategory.name)
//     expect(savedCategory.type).toEqual(newCategory.type)
//   })
// })
