declare module 'rmwc/Tabs' {
  import React, { ReactNode, SFC } from 'react'

  interface TabProps {
    children: string
  }

  export class Tab extends React.Component<TabProps> {}

  interface TabBarProps {
    children: React.ReactNode
    onChange?: (event: React.SyntheticEvent<EventTarget>) => void
    activeTabIndex?: number
  }

  export class TabBar extends React.Component<TabBarProps> {}
}
