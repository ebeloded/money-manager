import * as React from 'react'

interface State {
  filter: 'recent&overdue' | 'upcoming'
}

export class TransactionsListContainer extends React.Component<{}, State> {
  render() {
    return <div />
  }
}
