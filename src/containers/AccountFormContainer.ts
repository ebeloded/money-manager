import { AccountForm } from '~/components/accounts/AccountForm'
import { Database } from '~/db/db'
import { connectDB } from '~/db/react-db/DatabaseContext'
import { CreateAccount } from '~/types'

const mapActionsToProps = (db: Database) => {
  return {
    submitAccount: (newAccount: CreateAccount) => {
      return db.accounts.add(newAccount)
    },
  }
}

const withDB = connectDB(null, mapActionsToProps)

export const AccountFormContainer = withDB(AccountForm)
