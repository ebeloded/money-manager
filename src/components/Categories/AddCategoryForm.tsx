import * as React from 'react'
import { DatabaseConsumer } from 'db/DatabaseContext'
import { Database } from 'db/Database'

interface AddCategoryFormProps {
  categoryType: CategoryType
}

class AddCategoryFormWithDB extends React.Component<AddCategoryFormProps & { db: Database }> {
  state = {
    name: '',
    disabled: false,
  }

  readonly db = this.props.db

  inputRef = React.createRef<HTMLInputElement>()

  componentDidMount() {
    console.log('component did mount')
    this.focusOnInput()
  }

  focusOnInput = () => {
    if (this.inputRef.current) this.inputRef.current.focus()
  }

  componentWillUnmount() {
    console.log('component will unmount')
  }

  onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { name } = this.state
    const type = this.props.categoryType
    this.setState({ disabled: true }, () => {
      this.db.categories.add({ name, type }).then(() => {
        this.setState({
          name: '',
          disabled: false,
        })
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
        />
      </form>
    )
  }
}
export const AddCategoryForm = (props: AddCategoryFormProps) => (
  <DatabaseConsumer>{(db: Database) => <AddCategoryFormWithDB db={db} {...props} />}</DatabaseConsumer>
)
