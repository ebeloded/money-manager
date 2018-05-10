import * as React from 'react'
import { Observable, Subscription } from 'rxjs'
import { Log } from '~/utils/log'
import { Database } from '../db'

const log = Log('DatabaseContext')

interface DatabaseProviderProps {
  db: Database
  children: React.ReactNode
}

const { Provider, Consumer } = React.createContext(new Database())

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

const debug = Log('Database:ConnectedToDatabaseComponent:')

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
) => (Original: React.ComponentType) => React.ComponentType<any>

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
  children: (derivedProps: {}) => React.ReactNode
}
export class ConnectedContainer extends React.Component<ConnectedContainerProps> {
  render() {
    return this.props.children({})
  }
}
