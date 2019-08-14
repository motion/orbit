import { isEqual } from '@o/fast-compare'
import { createStoreContext } from '@o/use-store'
import React, { createContext, useContext, useEffect } from 'react'

import { useStoresSimple } from '../hooks/useStores'

const validAppProps = ['index', 'children', 'statusBar', 'toolBar', 'context', 'actions']

export type RenderAppProps = {
  statusbar: React.ReactElement | false
  main: React.ReactElement | false
  sidebar: React.ReactElement | false
  toolbar: React.ReactElement | false
  actions: React.ReactElement | false
}

export type RenderAppFn = (props: RenderAppProps) => React.ReactNode

const defaultRenderApp: RenderAppFn = ({ statusbar, main, sidebar, toolbar, actions }) => {
  return (
    <>
      {statusbar}
      {main}
      {sidebar}
      {toolbar}
      {actions}
    </>
  )
}

export type AppMainViewProps = {
  children: React.ReactNode
  hasSidebar: boolean
  hasStatusbar: boolean
  hasToolbar: boolean
  hasMain: boolean
}

type AppMainView = React.FunctionComponent<AppMainViewProps>

type IAppViewsContext = {
  renderApp?: RenderAppFn
  Toolbar?: AppMainView | undefined
  Statusbar?: AppMainView | undefined
  Main?: AppMainView | undefined
  Sidebar?: AppMainView | undefined
  Actions?: React.FunctionComponent | undefined
}

export const AppViewsContext = createContext<IAppViewsContext>({
  renderApp: defaultRenderApp,
})

export type AppMenuItem = {
  title?: string
  subTitle?: string
  icon?: string
  after?: string
  checked?: boolean
}

export type AppProps = {
  index?: React.ReactNode
  children?: React.ReactNode
  statusBar?: React.ReactNode
  toolBar?: React.ReactNode
  context?: any
  actions?: React.ReactNode
  menuItems?: AppMenuItem[]
}

const IDView = props => props.children

class ParentAppStore {
  didMountChild = false
}
const ParentApp = createStoreContext(ParentAppStore)

export const App = (props: AppProps) => {
  // this helps us detect if we are a child <App /> of <App />
  const parentApp = ParentApp.useStore()
  // else we are the parent
  const currentApp = parentApp || ParentApp.useCreateStore()
  useEffect(() => {
    if (parentApp) {
      parentApp.didMountChild = true
    }
  }, [parentApp])

  for (const key in props) {
    if (!validAppProps.find(x => x === key)) {
      throw new Error(`Invalid prop passed ${key}`)
    }
  }

  const { appStore } = useStoresSimple()
  const appViewsContext = useContext(AppViewsContext)
  const {
    renderApp = defaultRenderApp,
    Statusbar = IDView,
    Main = IDView,
    Sidebar = IDView,
    Toolbar = IDView,
    Actions = IDView,
  } = appViewsContext
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
    if (currentApp.didMountChild || !appStore) {
      // dont do anything if we are the parent, the child will do this...
      return
    }
    if (!isEqual(props.menuItems, appStore.menuItems)) {
      appStore.setMenuItems(props.menuItems!)
    }
    return () => {
      appStore.setMenuItems([])
    }
  }, [props.menuItems])

  return (
    <ParentApp.SimpleProvider value={parentApp || currentApp}>
      {renderApp({
        statusbar: hasStatusbar && <Statusbar {...hasProps}>{props.statusBar}</Statusbar>,
        main: hasMain && <Main {...hasProps}>{props.children}</Main>,
        sidebar: hasSidebar && <Sidebar {...hasProps}>{props.index}</Sidebar>,
        toolbar: hasToolbar && <Toolbar {...hasProps}>{props.toolBar}</Toolbar>,
        actions: hasActions && <Actions {...hasProps}>{props.actions}</Actions>,
      })}
    </ParentApp.SimpleProvider>
  )
}

App.isApp = true

export const AppMenuItems: { [key: string]: AppMenuItem } = {
  ShowHints: {
    title: 'Show Hints',
  },
}
