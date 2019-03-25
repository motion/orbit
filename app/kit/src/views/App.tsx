import React, { createContext, useContext } from 'react'
import { AppElements } from '../types/AppDefinition'

const validAppProps = ['index', 'children', 'statusBar', 'toolBar', 'context']

export type AppMainViewProps = {
  children: React.ReactElement<any>
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
})

export function App(props: AppElements) {
  for (const key in props) {
    if (!validAppProps.find(x => x === key)) {
      throw new Error(`Invalid prop passed ${key}`)
    }
  }

  const { Statusbar, Main, Sidebar, Toolbar } = useContext(AppViewsContext)
  const hasStatusbar = !!props.statusBar && !!Statusbar
  const hasMain = !!props.children && !!Main
  const hasSidebar = !!props.index && !!Sidebar
  const hasToolbar = !!props.toolBar && !!Toolbar
  const hasProps = {
    hasStatusbar,
    hasMain,
    hasSidebar,
    hasToolbar,
  }

  return (
    <>
      {hasStatusbar && <Statusbar {...hasProps}>{props.statusBar}</Statusbar>}
      {hasMain && (
        <Main hasSidebar={!!props.index} {...hasProps}>
          {props.children}
        </Main>
      )}
      {hasSidebar && <Sidebar {...hasProps}>{props.index}</Sidebar>}
      {hasToolbar && <Toolbar {...hasProps}>{props.toolBar}</Toolbar>}
    </>
  )
}
