import * as React from 'react'

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
    name: '',
    disabled: false,
  }

  state = {
    name: this.props.name || '',
    disabled: false,
  }

  inputRef = React.createRef<HTMLInputElement>()

  componentDidMount() {
    this.focusOnInput()
  }

  focusOnInput = () => {
    if (this.inputRef.current) this.inputRef.current.focus()
  }

  onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const category = {
      type: this.props.type,
      name: this.state.name,
    }

    this.setState({ disabled: true }, () => {
      this.props.onSubmit(category).then(() => {
        this.setState(this.defaultState)
        this.focusOnInput()
      })
    })
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.currentTarget.value })
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <input
          ref={this.inputRef}
          disabled={this.state.disabled}
          type="text"
          value={this.state.name}
          onChange={this.handleChange}
          placeholder="Add Category"
          required={true}
        />
      </form>
    )
  }
}
