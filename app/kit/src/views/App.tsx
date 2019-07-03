import { isEqual } from '@o/fast-compare'
import React, { createContext, useContext, useEffect } from 'react'

import { useStoresSimple } from '../hooks/useStores'

const validAppProps = ['index', 'children', 'statusBar', 'toolBar', 'context', 'actions']

export type AppMainViewProps = {
  children: React.ReactNode
  hasSidebar: boolean
  hasStatusbar: boolean
  hasToolbar: boolean
  hasMain: boolean
}

type AppMainView = React.FunctionComponent<AppMainViewProps>

export const AppViewsContext = createContext({
  Toolbar: null as AppMainView,
  Statusbar: null as AppMainView,
  Main: null as AppMainView,
  Sidebar: null as AppMainView,
  Actions: null as React.FunctionComponent,
})

export type AppMenuItem = {
  title?: string
  subTitle?: string
  icon?: string
  after?: string
  checked?: boolean
}

export type AppProps = {
  index?: React.ReactElement<any>
  children?: React.ReactNode
  statusBar?: React.ReactElement<any>
  toolBar?: React.ReactElement<any>
  context?: any
  actions?: React.ReactElement<any>
  menuItems?: AppMenuItem[]
}

export const App = (props: AppProps) => {
  console.log('render app', props)

  for (const key in props) {
    if (!validAppProps.find(x => x === key)) {
      throw new Error(`Invalid prop passed ${key}`)
    }
  }

  const { appStore } = useStoresSimple()
  const { Statusbar, Main, Sidebar, Toolbar, Actions } = useContext(AppViewsContext)
  const hasStatusbar = !!props.statusBar && !!Statusbar
  const hasMain = !!props.children && !!Main
  const hasSidebar = !!props.index && !!Sidebar
  const hasToolbar = !!props.toolBar && !!Toolbar
  const hasActions = !!props.actions && !!Actions
  const hasProps = {
    hasStatusbar,
    hasMain,
    hasSidebar,
    hasToolbar,
  }

  useEffect(() => {
    if (!isEqual(props.menuItems, appStore.menuItems)) {
      appStore.setMenuItems(props.menuItems)
    }
  }, [props.menuItems])

  return (
    <>
      {hasStatusbar && <Statusbar {...hasProps}>{props.statusBar}</Statusbar>}
      {hasMain && <Main {...hasProps}>{props.children}</Main>}
      {hasSidebar && <Sidebar {...hasProps}>{props.index}</Sidebar>}
      {hasToolbar && <Toolbar {...hasProps}>{props.toolBar}</Toolbar>}
      {hasActions && <Actions {...hasProps}>{props.actions}</Actions>}
    </>
  )
}

App.isApp = true

// const useMemoElement = (el: React.ReactNode) => {
//   const state = useRef({
//     version: 0,
//     last: null,
//   })
//   if (!isEqual(el, state.current.last)) {
//     state.current.version++
//   }
//   return useMemo(() => el, [state.current.version])
// }

export const AppMenuItems: { [key: string]: AppMenuItem } = {
  ShowHints: {
    title: 'Show Hints',
  },
}
