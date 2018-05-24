import { Database } from '~/db/db'
import { connectDB } from '~/db/react-db/DatabaseContext'
import { NewTransaction } from '~/types'
import { TransactionForm } from '../components/transactions/TransactionForm'

const mapDataToProps = (db) => {
  return {
    accounts: db.accounts.all,
    categories: db.categories.all,
  }
}

const mapActionsToProps = (db: Database) => ({
  onSubmitTransaction: (t: NewTransaction) => {
    return db.transactions.add(t)
  },
})

const withDB = connectDB(mapDataToProps, mapActionsToProps)

export const TransactionFormContainer = withDB(TransactionForm)
