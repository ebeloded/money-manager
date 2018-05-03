import React from 'react'
import { TransactionFormContainer } from './Transactions/TransactionForm'
// import Chance from 'chance'

// const chance = new Chance()

// interface SimpleProps {
//   name: string
// }

// class SimpleClassComponent extends React.Component<SimpleProps, {}> {
//   render() {
//     const { name } = this.props
//     return <div>This is Simple Container {name}</div>
//   }
// }

// const SimpleFunctionalComponent = ({ name }: SimpleProps) => {
//   return <div>This is Simple Functional Component {name}</div>
// }

// const simpleClassConnect = (ownProps) => (OriginalComponent) =>
//   class ConnectedComponent extends React.Component<any> {
//     render() {
//       return <OriginalComponent {...ownProps} {...this.props} />
//     }
//   }

// const simpleFunctionalConnect = (ownProps) => (OriginalComponent) => (props) => {
//   return <OriginalComponent {...ownProps} {...props} />
// }

// const withConnect = simpleFunctionalConnect({ name: chance.word() })

// const SimpleFunctionalContainer = withConnect(SimpleFunctionalComponent)
// const SimpleClassContainer = withConnect(SimpleClassComponent)

export const App = () => {
  return <TransactionFormContainer />
}
