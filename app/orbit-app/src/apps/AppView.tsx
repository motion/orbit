import * as React from 'react'
import { StoreContext } from '@mcro/black'
import { AppStore } from './AppStore'
import { apps } from './apps'
import { AppProps } from './AppProps'
import { useStore } from '@mcro/use-store'

export function AppView(
  props: Pick<AppProps, 'id' | 'view' | 'title' | 'type' | 'isActive'> & { appStore?: AppStore },
) {
  const stores = React.useContext(StoreContext)
  // ensure just one appStore ever is set in this tree
  const shouldProvideAppStore = !stores.appStore && !props.appStore
  const appStore = useStore(
    AppStore,
    { ...props, ...stores },
    { conditionalUse: shouldProvideAppStore },
  )
  const App = apps[props.type][props.view]
  if (typeof App !== 'function') {
    console.error('WAHT THE FUCK', props.type, App)
    return null
  }
  const appView = (
    <App
      {...props}
      appStore={props.appStore || stores.appStore || appStore}
      sourcesStore={stores.sourcesStore}
      settingStore={stores.settingStore}
      subPaneStore={stores.subPaneStore}
      queryStore={stores.queryStore}
    />
  )
  if (shouldProvideAppStore) {
    return <StoreContext.Provider value={{ ...stores, appStore }}>{appView}</StoreContext.Provider>
  }
  return appView
}
