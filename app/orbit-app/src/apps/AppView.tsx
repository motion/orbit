import * as React from 'react'
import { StoreContext } from '@mcro/black'
import { AppStore } from './AppStore'
import { apps } from './apps'
import { AppProps } from './AppProps'
import { useStore } from '@mcro/use-store'

type Props = Pick<
  AppProps<any>,
  'id' | 'viewType' | 'type' | 'isActive' | 'itemProps' | 'appConfig'
> & {
  title?: string
  appStore?: AppStore<any>
  onAppStore?: Function
}

export const AppView = React.memo((props: Props) => {
  const stores = React.useContext(StoreContext)
  // ensure just one appStore ever is set in this tree
  const shouldProvideAppStore = !stores.appStore && !props.appStore
  const appStore = useStore(
    AppStore,
    { ...props, ...stores },
    { conditionalUse: shouldProvideAppStore },
  )

  React.useEffect(() => {
    if (props.onAppStore) {
      props.onAppStore(appStore)
    }
  }, [])

  if (!apps[props.type]) {
    console.error('NO APP OF TYPE', props.type, props)
    return null
  }
  const AppView = apps[props.type][props.viewType]
  if (!AppView) {
    console.error('WAHT THE FUCK', props.type, props.viewType, AppView)
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
      spaceStore={stores.spaceStore}
    />
  )
  if (shouldProvideAppStore) {
    return <StoreContext.Provider value={{ ...stores, appStore }}>{appView}</StoreContext.Provider>
  }
  return appView
})
