import React from 'react'
import styled from 'react-emotion'

interface Props {
  onSubmit: (transaction: Transaction) => void
}

interface State {
  value: string
}

const Input = styled('input')({
  border: 'solid 1px grey',
  padding: '5px',
})

const NumberInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <Input {...props} />
}

export class AddTransactionForm extends React.Component<Props, State> {
  public state: State = {
    value: '',
  }

  constructor(props: Props) {
    super(props)
  }

  public onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const transaction: Transaction = {
      value: +this.state.value,
    }
    this.props.onSubmit(transaction)
  }

  public onChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ value: event.currentTarget.value })
  }

  public render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input value={this.state.value} onChange={this.onChange} />
      </form>
    )
  }
}
