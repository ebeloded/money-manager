import { Form, TextField } from '@elements/Form'
import * as React from 'react'
import { Category, CategoryID, CategoryType, NewCategory } from '~/types'

interface Props {
  name?: string
  type: CategoryType
  onSubmit: (category: NewCategory | Category) => Promise<CategoryID>
}

interface State {
  name: string
  disabled: boolean
}

export class CategoryForm extends React.Component<Props, State> {
  defaultState = {
    disabled: false,
    name: '',
  }

  state = {
    disabled: false,
    name: this.props.name || '',
  }

  inputRef = React.createRef<HTMLInputElement>()

  componentDidMount() {
    this.focusOnInput()
  }

  focusOnInput = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focus()
    }
  }

  onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const category: NewCategory = {
      categoryType: this.props.type,
      name: this.state.name,
    }

    this.setState({ disabled: true }, () => {
      this.props.onSubmit(category).then(() => {
        this.setState(this.defaultState)
        this.focusOnInput()
      })
    })
  }

  handleChange = (name: string) => {
    this.setState({ name })
  }

  render() {
    return (
      <Form onSubmit={this.onFormSubmit}>
        <TextField
          box={true}
          inputRef={this.inputRef}
          disabled={this.state.disabled}
          type="text"
          value={this.state.name}
          onChangeValue={this.handleChange}
          label="Add Category"
          required={true}
        />
      </Form>
    )
  }
}
