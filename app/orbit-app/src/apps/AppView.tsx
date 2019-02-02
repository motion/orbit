import { useStore } from '@mcro/use-store'
import * as React from 'react'
import { SmallListItemPropsProvider } from '../components/SmallListItemPropsProvider'
import { StoreContext } from '../contexts'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { GenericComponent } from '../types'
import { MergeContext } from '../views/MergeContext'
import { AppProps } from './AppProps'
import { apps } from './apps'
import { AppStore } from './AppStore'

export type AppViewProps = Pick<
  AppProps<any>,
  'id' | 'title' | 'viewType' | 'type' | 'isActive' | 'appConfig'
> & {
  title?: string
  appStore?: AppStore<any>
  onAppStore?: Function
}

export const AppView = React.memo(function AppView(props: AppViewProps) {
  const stores = useStoresSafe({ optional: ['appStore', 'subPaneStore'] })
  // ensure just one appStore ever is set in this tree
  // warning should never change it if you pass in a prop
  const appStore = props.appStore || useStore(AppStore, props)

  React.useEffect(() => {
    if (props.onAppStore) {
      props.onAppStore(appStore)
    }
  }, [])

  const appElement = React.useMemo(() => {
    if (!apps[props.type]) {
      return <div>noo app of type {props.type}</div>
    }

    const AppView = apps[props.type][props.viewType] as GenericComponent<AppProps<any>>

    if (!AppView) {
      return (
        <div>
          not found {props.type} {props.viewType}
        </div>
      )
    }

    const appElement = (
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

    // small rendering for index views
    if (props.viewType === 'index') {
      return <SmallListItemPropsProvider>{appElement}</SmallListItemPropsProvider>
    }

    // regular rendering for others
    return appElement
  }, Object.values(props))

  if (!props.appStore) {
    return (
      <MergeContext Context={StoreContext} value={{ appStore }}>
        {appElement}
      </MergeContext>
    )
  }

  return appElement
})
