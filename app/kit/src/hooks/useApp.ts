import { useReaction } from '@mcro/use-store'
import { AppStore } from '../stores'
import { AppDefinition, AppViews } from '../types/AppDefinition'
import { useStoresSimple } from './useStores'

type UseAppProps = {
  id: string
  appStore?: AppStore
}

export function useApp(
  props: UseAppProps,
): {
  views: AppViews
  appStore: AppStore
  provideStores: Object
  definition: AppDefinition
} {
  const stores = useStoresSimple()
  return useReaction(() => {
    const next = {
      appStore: props.appStore || stores.appStore || null,
      views: {},
      provideStores: null,
      definition: null,
    }
    if (stores.appsStore) {
      const state = stores.appsStore.appsState
      if (!state) return next
      const { appStores, appViews, provideStores } = state
      next.appStore = next.appStore || appStores[props.id]
      next.views = appViews[props.id] || {}
      next.provideStores = provideStores[props.id] || null
      next.definition = stores.appsStore.definitions[props.id] || null
    }
    return next
  })
}
