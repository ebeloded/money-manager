import React from 'react'

interface Props {
  category: Category
  onClickDelete: (cid: CategoryID) => void
}
export class CategoryListItem extends React.PureComponent<Props> {
  handleClick = () => {
    this.props.onClickDelete(this.props.category.id)
  }

  render() {
    console.log('render category item')

    return <li onClick={this.handleClick}>{this.props.category.name}</li>
  }
}
