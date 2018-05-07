import Debug from 'debug'
import React, { ReactNode } from 'react'
import { Observable, Subscription } from 'rxjs'
import { Database } from './Database'

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
  [name: string]: (...args: any[]) => Promise<any>
}

interface Props {
  mapDataToProps: MapDataToProps | null
  mapActionsToProps: MapActionsToProps | null
  children: (derivedProps: any) => React.ReactNode
}

const debug = Debug('Database:ConnectedToDatabaseComponent:')

class ObservablesResolver extends React.PureComponent<Props> {
  private dataSubscriptions: Subscription[] = []

  componentDidMount() {
    const { mapDataToProps } = this.props
    if (mapDataToProps !== null) {
      this.dataSubscriptions = Object.keys(mapDataToProps).map((key) =>
        mapDataToProps[key].subscribe((data) => {
          debug('Data Updated %s %O', key, data)
          this.setState({ [key]: data })
        }),
      )
    }
  }

  componentWillUnmount() {
    debug('willUnmount')

    this.dataSubscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
  }

  render() {
    return this.props.children({ ...this.state, ...this.props.mapActionsToProps })
  }
}
type mapDataToPropsFactory = (db: Database, ownProps: any) => MapDataToProps
type mapActionsToPropsFactory = (db: Database, ownProps: any) => MapActionsToProps

type connectDBType = (
  mapDataToProps: mapDataToPropsFactory | null,
  mapActionsToProps?: mapActionsToPropsFactory,
) => (OriginalComopnent: React.ComponentType) => React.ComponentType<any>

export const connectDB: connectDBType = (mapDataToProps, mapActionsToProps) => (OriginalComponent) =>
  class ConnectedComponent extends React.PureComponent {
    render() {
      const props = this.props
      return (
        <Consumer>
          {(db: Database) => (
            <ObservablesResolver
              mapDataToProps={mapDataToProps ? mapDataToProps(db, props) : null}
              mapActionsToProps={mapActionsToProps ? mapActionsToProps(db, props) : null}
            >
              {(derivedProps) => {
                return <OriginalComponent {...props} {...derivedProps} />
              }}
            </ObservablesResolver>
          )}
        </Consumer>
      )
    }
  }

interface ConnectedContainerProps {
  mapDataToProps?: mapDataToPropsFactory
  mapActionsToProps?: mapActionsToPropsFactory
  children: (derivedProps: {}) => ReactNode
}
export class ConnectedContainer extends React.Component<ConnectedContainerProps> {
  render() {
    return this.props.children({})
  }
}
