import * as React from 'react'
import styled from 'react-emotion'
import { CategoryTypeEnum } from '@constants'

interface Props {
  categoryType: CategoryType
}

interface State {
  id?: string
  name: string
  type: CategoryType
}

const FormWrap = styled('form')``

export class EditCategoryForm extends React.Component<Props, State> {
  state = {
    name: '',
    type: this.props.categoryType,
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Add the category to the database
  }

  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      name: event.currentTarget.value,
    })
  }

  render() {
    return (
      <FormWrap onSubmit={this.handleSubmit}>
        <label htmlFor="">
          <input
            placeholder="Add Category"
            type="text"
            name="name"
            onChange={this.handleChange}
            value={this.state.name}
          />
        </label>
      </FormWrap>
    )
  }
}
