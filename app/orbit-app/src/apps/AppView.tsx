import { useStore } from '@mcro/use-store'
import * as React from 'react'
import { StoreContext } from '../contexts'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { GenericComponent } from '../types'
import { MergeContext } from '../views/MergeContext'
import { AppProps } from './AppProps'
import { AppStore } from './AppStore'

export type AppViewProps = Pick<
  AppProps<any>,
  'id' | 'title' | 'viewType' | 'type' | 'isActive' | 'itemProps' | 'appConfig'
> & {
  title?: string
  appStore?: AppStore<any>
  onAppStore?: Function
}

export default React.memo(function AppView(props: AppViewProps) {
  const stores = useStoresSafe({ optional: ['appStore', 'subPaneStore'] })
  // ensure just one appStore ever is set in this tree
  // warning should never change it if you pass in a prop
  const appStore = props.appStore || useStore(AppStore, props)

  React.useEffect(() => {
    if (props.onAppStore) {
      props.onAppStore(appStore)
    }
  }, [])

  if (!stores.appsStore.apps[props.type]) {
    return <div>noo app of type {props.type}</div>
  }

  const AppView = stores.appsStore.apps[props.type][props.viewType] as GenericComponent<
    AppProps<any>
  >

  if (!AppView) {
    return null
  }

  const appView = (
    <AppView
      appStore={props.appStore || appStore}
      sourcesStore={stores.sourcesStore}
      settingStore={stores.settingStore}
      subPaneStore={stores.subPaneStore}
      queryStore={stores.queryStore}
      spaceStore={stores.spaceStore}
      paneManagerStore={stores.paneManagerStore}
      {...props}
    />
  )

  if (!props.appStore) {
    return (
      <MergeContext Context={StoreContext} value={{ appStore }}>
        {appView}
      </MergeContext>
    )
  }

  return appView
})
