import * as React from 'react'

import { Tab, TabBar } from '@elements/Tabs'
import { TransactionType } from '~/types'
import { Log } from '~/utils/log'

interface Props {
  onChange: (transactionType: TransactionType) => void
  value: TransactionType
}

const TransactionTypesArray: TransactionType[] = Object.keys(TransactionType).map((key) => TransactionType[key])

const log = Log('TransactionTypeSelect')

export class TransactionTypeSelect extends React.Component<Props> {
  handleChange = ({ target }) => this.props.onChange(TransactionTypesArray[target.value])

  render() {
    log('render %o', this.props)

    return (
      <TabBar onChange={this.handleChange}>
        {TransactionTypesArray.map((name, index) => <Tab key={index}>{name}</Tab>)}
      </TabBar>
    )
  }
}
