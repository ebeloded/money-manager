import { AccountsList } from '~/components/accounts/AccountsList'
import { connectDB } from '~/db/react-db/DatabaseContext'
import { AccountID } from '~/types'

const withDB = connectDB(
  (db) => ({
    accounts: db.accounts.all,
  }),
  (db) => ({
    deleteAccount: (id: AccountID) => db.accounts.remove(id),
  }),
)

export const AccountsListController = withDB(AccountsList)
