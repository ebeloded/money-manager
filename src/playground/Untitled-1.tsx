class Database {
  async someDatabaseMethod() {
    return 'I am from DB'
  }
}

const methodDecorator: MethodDecorator = (target, propertyKey: string, descriptor: PropertyDescriptor) => {}

const injectDB: ClassDecorator = target => {
  console.log('class decorator invoked', target)
  target.prototype.db = new Database()
  return target
}

@injectDB
class Transactions {
  private db: Database
  constructor(private somePromise: Promise<boolean>) {}

  async sayHello() {
    console.log(this.db)
    const valueFromDB = await this.db.someDatabaseMethod()
    const result = await this.somePromise
    return valueFromDB
  }
}

const promise: Promise<boolean> = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('resolvingPromise')
    resolve(true)
  }, 1000)
})

const transactions = new Transactions(promise)

const hello = transactions.sayHello()
hello.then(result => console.log(result))

export {}
