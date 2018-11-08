import * as React from 'react'
import { StoreContext } from '@mcro/black'
import { AppStore } from './AppStore'
import { apps } from './apps'
import { AppProps } from './AppProps'
import { useStore } from '@mcro/use-store'

// if you provide an appStore in props it will use that
// otherwise it will create a new one and use the stores from context to instantiate

export function AppView(
  props: Pick<AppProps, 'id' | 'view' | 'title' | 'type' | 'isActive'> & { appStore?: AppStore },
) {
  const stores = React.useContext(StoreContext)
  const shouldProvideAppStore = !stores.appStore
  const appStore = useStore(AppStore, stores, { conditionalUse: shouldProvideAppStore })
  const App = apps[props.type][props.view]
  if (typeof App !== 'function') {
    console.error('WAHT THE FUCK', props.type, App)
    return null
  }
  const appView = (
    <App
      {...props}
      appStore={props.appStore || appStore}
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
