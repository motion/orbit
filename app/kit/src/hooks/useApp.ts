import { react, useHook, useStore } from '@mcro/use-store'
import { AppStore } from '../stores'
import { AppViews } from '../types/AppDefinition'
import { useStoresSimple } from './useStores'

type UseAppProps = {
  id: string
  appStore?: AppStore
}

type UseAppResponse = {
  appViews: AppViews
  appStore: AppStore
  provideStores: Object
}

class UseAppStore {
  props: UseAppProps
  stores = useHook(useStoresSimple)

  state = react(() => {
    const { stores, props } = this
    const next: UseAppResponse = {
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
        next.appStore = appStores[props.id]
      }
      // set view
      next.appViews = appViews[props.id] || {}
      next.provideStores = provideStores[props.id] || null
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
