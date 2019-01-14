import * as React from 'react'
import { AppStore } from './AppStore'
import { apps } from './apps'
import { AppProps } from './AppProps'
import { useStore } from '@mcro/use-store'
import { GenericComponent } from '../types'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { MergeContext } from '../views/MergeContext'
import { StoreContext } from '../contexts'

type Props = Pick<
  AppProps<any>,
  | 'id'
  | 'title'
  | 'viewType'
  | 'type'
  | 'isActive'
  | 'itemProps'
  | 'appConfig'
  | 'onSelectItem'
  | 'onOpenItem'
> & {
  title?: string
  appStore?: AppStore<any>
  onAppStore?: Function
}

export const AppView = React.memo((props: Props) => {
  console.log('rendering app view 123', props)
  const stores = useStoresSafe({ optional: ['appStore', 'subPaneStore'] })
  // ensure just one appStore ever is set in this tree
  // const shouldProvideAppStore = !stores.appStore && !props.appStore
  const appStore = useStore(AppStore, props)

  React.useEffect(() => {
    if (props.onAppStore) {
      props.onAppStore(appStore)
    }
  }, [])

  if (!apps[props.type]) {
    console.error('NO APP OF TYPE', props.type, props)
    return null
  }
  const AppView = apps[props.type][props.viewType] as GenericComponent<AppProps<any>>
  if (!AppView) {
    return (
      <div>
        no app view for {props.type} {props.viewType}
      </div>
    )
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
      data={{}}
      updateData={_ => _}
      {...props}
    />
  )
  if (true) {
    return (
      <MergeContext Context={StoreContext} value={{ appStore }}>
        {appView}
      </MergeContext>
    )
  }
  // return appView
})
