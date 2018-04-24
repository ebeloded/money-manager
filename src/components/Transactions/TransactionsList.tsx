import React from 'react'

interface Props {
  transactions: Transaction[]
}

interface State {}

const TransactionItem = (t: Transaction) => {
  return <li>{t.value}</li>
}

export class TransactionsList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  public render() {
    return <ol>{this.props.transactions.map((t, i) => <TransactionItem key={i.toString()} {...t} />)}</ol>
  }
}
