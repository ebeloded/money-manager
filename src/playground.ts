import { Observable, from, defer, of } from 'rxjs'
import { switchMap, concatMap, share, publish, tap } from 'rxjs/operators'

const myPromise = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('bla')
    }, 1)
  })

// const myObservable = new Observable((subscriber) => {
//   myPromise().then((v) => subscriber.next(v))

//   return function unsubscribe() {}
// })

const myObservable = (someValue: string) =>
  defer(async function() {
    console.log('called my observable')
    await myPromise()
    return 0
  }).pipe(publish())

const myOtherObservable = (someValue: string) => {
  console.log('myOtherObservable called')
  return from(myPromise()).pipe(
    concatMap((promisedValue) => {
      console.log(promisedValue)
      console.log('called my observable')
      return of(0)
    }),
  )
}

async function main() {
  myObservable('hello')
  myOtherObservable('otherHello').subscribe((v) => console.log(v))
}

main()
