import * as React from 'react'
import { StoreContext } from '@mcro/black'
import { AppStore } from './AppStore'
import { apps } from './apps'
import { AppProps } from './AppProps'
import { useStore } from '@mcro/use-store'
import { memo } from '../helpers/memo'

type Props = Pick<AppProps, 'id' | 'viewType' | 'type' | 'isActive' | 'itemProps' | 'appConfig'> & {
  title?: string
  appStore?: AppStore
  onAppStore?: Function
}

export const AppView = memo((props: Props) => {
  const stores = React.useContext(StoreContext)
  // ensure just one appStore ever is set in this tree
  const shouldProvideAppStore = !stores.appStore && !props.appStore
  const appStore = useStore(
    AppStore,
    { ...props, ...stores },
    { conditionalUse: shouldProvideAppStore },
  )
  if (props.onAppStore) {
    props.onAppStore(appStore)
  }
  if (!apps[props.type]) {
    console.error('NO APP OF TYPE', props.type, props)
    return null
  }
  const AppView = apps[props.type][props.viewType]
  if (!AppView) {
    console.error('WAHT THE FUCK', props.type, AppView)
    return null
  }
  const appView = (
    <AppView
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
})
