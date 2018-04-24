interface DB {
  doSomethingCool: () => string
}

const Database = async (): Promise<DB> => {
  return {
    doSomethingCool: () => {
      console.log('bla')
      return 'bla'
    },
  }
}

const myFunction = (db: DB) => (myString: string, number: number) => {
  return `muFunc called ${myString} ${db.doSomethingCool()}`
}

const resolver = (dbPromise: Promise<DB>) => <A, R>(f: (db: DB) => ((args: A[]) => R)) => async (
  args: A[],
): Promise<R> => {
  const db = await dbPromise

  const x = f.call(null, db)

  return x.apply(null, ...args)
}

async function main() {
  let db = await Database()
  const currentResult = myFunction(db)('CURRENT', 12)
  console.log(currentResult)

  // const f = resolver(Database())(myFunction)

  // const updatedResult = await f('UPDATED')
  // console.log(updatedResult)
}

main()
