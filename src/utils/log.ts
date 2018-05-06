import Debug from 'debug'

export function Log(namespace) {
  return Debug(`App:${namespace}`)
}
