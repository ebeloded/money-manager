import Debug from 'debug'
import React, { ReactNode } from 'react'
import { Observable, Subscription } from 'rxjs'
import { Database } from '.'

interface DatabaseProviderProps {
  db: Database
  children: ReactNode
}

const { Provider, Consumer } = React.createContext<Database>()

export const DatabaseProvider = ({ db, children }: DatabaseProviderProps) => {
  return <Provider value={db}>{children}</Provider>
}

interface MapDataToProps {
  [name: string]: Observable<any>
}

interface MapActionsToProps {
  [name: string]: (...args: any[]) => Observable<any>
}

interface Props {
  mapDataToProps: MapDataToProps
  mapActionsToProps: MapActionsToProps
  children: (derivedProps: any) => React.ReactNode
}

const debug = Debug('Database:ConnectedToDatabaseComponent:')

class ObservablesResolver extends React.Component<Props> {
  private subscriptions: Subscription[]

  componentDidMount() {
    debug('didMount %f', this.props.mapDataToProps)

    this.subscriptions = Object.keys(this.props.mapDataToProps).map((key) =>
      this.props.mapDataToProps[key].subscribe((data) => {
        debug('Data Updated %s %j', key, data)
        this.setState({ [key]: data })
      }),
    )
  }

  componentWillUnmount() {
    debug('willUnmount')
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
  }

  render() {
    return this.props.children({ ...this.state, ...this.props.mapActionsToProps })
  }
}
type mapDataToPropsFactory = (db: Database, ownProps: {}) => MapDataToProps
type mapActionsToPropsFactory = (db: Database, ownProps: {}) => MapActionsToProps

type connectDBType = (
  mapDataToProps: mapDataToPropsFactory,
  mapActionsToProps: mapActionsToPropsFactory,
) => (OriginalComopnent: React.ComponentType) => React.SFC

export const connectDB: connectDBType = (mapDataToProps, mapActionsToProps) => (OriginalComponent) => (props) => (
  <Consumer>
    {(db: Database) => (
      <ObservablesResolver mapActionsToProps={mapActionsToProps(db, props)} mapDataToProps={mapDataToProps(db, props)}>
        {(derivedProps) => {
          return <OriginalComponent {...props} {...derivedProps} />
        }}
      </ObservablesResolver>
    )}
  </Consumer>
)
