import React from 'react'
import styled from 'react-emotion'

interface Props {}

interface State {
  value: string
}

const Input = styled('input')({
  border: 'solid 1px grey',
  padding: '5px',
})

export class AddTransactionForm extends React.Component<Props, State> {
  state: State = {
    value: '',
  }

  constructor(props: Props) {
    super(props)
  }

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const transaction: Transaction = {
      value: +this.state.value,
    }
  }

  onChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ value: event.currentTarget.value })
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        Add transaction form
        <Input value={this.state.value} onChange={this.onChange} />
      </form>
    )
  }
}
