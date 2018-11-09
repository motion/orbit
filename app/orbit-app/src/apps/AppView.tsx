import * as React from 'react'
import { StoreContext } from '@mcro/black'
import { AppStore } from './AppStore'
import { apps } from './apps'
import { AppProps } from './AppProps'
import { useStore } from '@mcro/use-store'

type Props = Pick<AppProps, 'id' | 'view' | 'title' | 'type' | 'isActive'> & { appStore?: AppStore }

// to prevent excessive renders
class AppViewInner extends React.Component<AppProps & { AppView: any }> {
  shouldComponentUpdate() {
    return false
  }

  render() {
    const { AppView, ...props } = this.props
    return <AppView {...props} />
  }
}

export function AppView(props: Props) {
  const stores = React.useContext(StoreContext)
  // ensure just one appStore ever is set in this tree
  const shouldProvideAppStore = !stores.appStore && !props.appStore
  const appStore = useStore(
    AppStore,
    { ...props, ...stores },
    { conditionalUse: shouldProvideAppStore, debug: true },
  )
  console.log('rendering app', props.id, props.type, props.view)
  const AppView = apps[props.type][props.view]
  if (typeof AppView !== 'function') {
    console.error('WAHT THE FUCK', props.type, AppView)
    return null
  }
  const appView = (
    <AppViewInner
      AppView={AppView}
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
