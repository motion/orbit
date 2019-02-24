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
  const { appsStore, appStore } = useStoresSimple()
  const next = {
    appStore: props.appStore || appStore || null,
    views: {},
    provideStores: null,
    definition: null,
  }
  return (
    useReaction(() => {
      const state = appsStore.appsState
      if (!state) {
        return next
      }
      next.definition = state.definitions[props.id] || null
      const { appStores, appViews, provideStores } = state
      next.appStore = next.appStore || appStores[props.id]
      next.views = appViews[props.id] || {}
      next.provideStores = provideStores[props.id] || null
      return next
    }) || next
  )
}
