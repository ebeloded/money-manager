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

declare module 'rmwc/Card'

declare module 'rmwc/Button'

declare module 'rmwc/Select'

declare module 'rmwc/Grid'

declare module 'rmwc/List'

declare module 'rmwc/FormField'

declare module 'rmwc/TextField'
