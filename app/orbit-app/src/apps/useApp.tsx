import { react } from '@mcro/black'
import { useHook, useStore } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'
import { AppStore } from './AppStore'
import { AppViews } from './AppTypes'

// needs either an id or a type
type UseAppProps = {
  id?: string
  type?: string
  appStore?: AppStore
}

type AppState = {
  appViews: AppViews
  appStore: AppStore
  provideStores: Object
}

class UseAppStore {
  props: UseAppProps
  stores = useHook(useStoresSimple)
  state = react(() => {
    const { stores, props } = this
    const next: AppState = {
      appStore: props.appStore || stores.appStore || null,
      appViews: {},
      provideStores: null,
    }
    if (stores.appsStore) {
      const state = stores.appsStore.appsState
      if (!state) return next
      const { appStores, appViews, provideStores } = state
      // set store
      if (!next.appStore) {
        next.appStore = appStores[props.id] || appStores[props.type]
      }
      // set view
      next.appViews = appViews[props.id] || appViews[props.type] || {}
      next.provideStores = provideStores[props.id] || provideStores[props.type] || null
    }
    return next
  })
}

export function useApp(props: UseAppProps) {
  const useAppStore = useStore(UseAppStore, props)
  return (
    useAppStore.state || {
      appStore: null,
      appViews: {},
      provideStores: {},
    }
  )
}
