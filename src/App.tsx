// import React from 'react'
// import styled, { css, injectGlobal } from 'react-emotion'

// // import { AddTransactionForm } from './components/Transactions/AddTransactionForm'
// // import { ListTransactionsContainer } from './components/Transactions/ListTransactionsContainer'
// import Database from './db/Database'
// import { DatabaseConsumer, DatabaseProvider } from './db/DatabaseContext'
// import Transactions from './db/Transactions'

// function DatabaseName(props: { name: string; transactions: Transactions }) {
//   console.log('render db name', props)
//   return <div>Name is: {props.name}</div>
// }

// interface TransactionsContainerProps {
//   transactions: Transactions
// }

// class TransactionsContainer extends React.Component<TransactionsContainerProps> {
//   private transactionsSubscription

//   componentDidMount() {
//     console.log('component did mount')
//     this.props.transactions.getAll(transactions => {
//       this.setState({
//         transactions,
//       })
//     })
//   }

//   componentWillUnmount() {
//     console.log('component will unmount')
//   }

//   render() {
//     return <div>Transactions Container</div>
//   }
// }

// const AppWrap = styled('div')({
//   fontFamily: 'FiraMono',
// })

// const Title = styled('h1')({
//   color: '#eee',
// })

// injectGlobal('html', {
//   background: '#222',
//   color: '#eee',
// })

// interface State {
//   transactions: Transaction[]
// }

// class App extends React.Component<{}, State> {
//   public render() {
//     return (
//       <DatabaseProvider>
//         <AppWrap>
//           <Title>Money Manager</Title>
//           <DatabaseConsumer>{({ name, transactions }: Database) => <DatabaseName name={name} />}</DatabaseConsumer>
//         </AppWrap>
//       </DatabaseProvider>
//     )
//   }
// }

// export default App
