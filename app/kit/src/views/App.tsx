import React, { createContext, useContext } from 'react'
import { AppElements } from '../types/AppDefinition'

const validAppProps = ['index', 'children', 'statusBar', 'toolBar', 'context']

export const AppLoadContext = createContext({
  identifier: '',
  id: '',
})

export type AppSubViewProps = {
  children: React.ReactElement<any>
  hasSidebar: boolean
  hasStatusbar: boolean
  hasToolbar: boolean
  hasMain: boolean
}

type AppSubView = React.FunctionComponent<AppSubViewProps>

export const AppViewsContext = createContext({
  Toolbar: null as AppSubView,
  Statusbar: null as AppSubView,
  Main: null as AppSubView,
  Sidebar: null as AppSubView,
})

export function App(props: AppElements) {
  for (const key in props) {
    if (!validAppProps.find(x => x === key)) {
      throw new Error(`Invalid prop passed ${key}`)
    }
  }

  const { id, identifier } = useContext(AppLoadContext)

  if (!identifier || !id) {
    console.error('Internal bug, we didnt set context id + identifier')
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
