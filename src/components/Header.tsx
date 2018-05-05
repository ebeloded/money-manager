import * as React from 'react'
import { NavLink } from 'react-router-dom'

export class Header extends React.Component {
  render() {
    return (
      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/categories">Categories</NavLink>
      </nav>
    )
  }
}
