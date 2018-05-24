import { concatMap, map, shareReplay } from 'rxjs/operators'
import { ConstructorProps, Database } from '~/db/db'
import { Account, AccountID, CreateAccount } from '~/types'
import { Log } from '~/utils/log'

const log = Log('Database.MoneyCategories')

export class Accounts {
  all = this.init.firestore.pipe(
    concatMap((firestore) =>
      firestore
        .createSnapshotObservable(firestore.accounts)
        .pipe(map((querySnapshot) => firestore.querySnapshotToDocumentArray<Account>(querySnapshot)))
        .pipe(shareReplay()),
    ),
  )

  constructor(private init: ConstructorProps) {}

  add = async (newAccount: CreateAccount) => {
    const account: Account = {
      balance: newAccount.startingBalance,
      created: Date.now(),
      id: Database.generateID(),
      ...newAccount,
    }

    this.init.firestore
      .pipe(
        concatMap((firestore) => {
          return firestore.accounts.doc(account.id).set(account)
        }),
      )
      .subscribe({
        complete: () => log('complete add money account'),
        next: (v) => log('next add money account', v),
      })

    return account
  }

  remove = async (accountID: AccountID) => {
    this.init.firestore
      .pipe(
        concatMap((firestore) => {
          return firestore.accounts.doc(accountID).delete()
        }),
      )
      .subscribe({
        complete: () => log('complete add money account'),
        error: (err) => log('error', err),
        next: (v) => log('next add money account', v),
      })

    return true
  }
}
