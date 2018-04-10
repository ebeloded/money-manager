import React from 'react'

interface Props {
  transactions: Transaction[]
}

interface State {
}

const TransactionItem = (t: Transaction) => {
  return <li>{t.value}</li>
}

export class ListTransactionsContainer extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)
  }

  render () {
    return (
      <ol>
        {this.props.transactions.map((t, i) =>
          <TransactionItem key={i.toString()} {...t} />)}
      </ol>
    )
  }
}
