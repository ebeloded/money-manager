import React, { ReactNode } from 'react'
import { Database } from './Database'

interface DatabaseProviderProps {
  db: Database
  children: ReactNode
}

const { Provider, Consumer } = React.createContext<Database>()

export const DatabaseProvider = ({ db, children }: DatabaseProviderProps) => <Provider value={db}>{children}</Provider>

export const DatabaseConsumer = Consumer
