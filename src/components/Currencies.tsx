import * as React from 'react'
import { getCurrencies } from '@db/getCurrencies'

const currencies: Array<Currency> = getCurrencies()

export default class Currencies extends React.Component {
  render () {
    return (
      <div>
        <h1>Available currencies:</h1>
        {currencies.map((c) => <li key={c.code}>{c.name}</li>)}
      </div>
    )
  }
}
