import React, { createContext, useContext } from 'react'

import { AppElements } from '../types/AppDefinition'

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

export const App = function App(props: AppElements) {
  for (const key in props) {
    if (!validAppProps.find(x => x === key)) {
      throw new Error(`Invalid prop passed ${key}`)
    }
  }

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
