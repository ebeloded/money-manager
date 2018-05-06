import React from 'react'

interface Props {
  category: Category
  onClickDelete: (cid: CategoryID) => void
}
export class CategoryListItem extends React.Component<Props> {
  handleClick = () => {
    this.props.onClickDelete(this.props.category.id)
  }

  shouldComponentUpdate({ category }: Props) {
    return this.props.category.updated !== category.updated
  }

  render() {
    return <li onClick={this.handleClick}>{this.props.category.name}</li>
  }
}
