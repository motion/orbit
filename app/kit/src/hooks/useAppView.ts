import { useReaction } from '@mcro/use-store'
import { useStoresSimple } from './useStores'

export function useAppView(id: string, viewName: 'index' | 'main' | 'toolBar' | 'statusBar') {
  const { appsStore } = useStoresSimple()
  return useReaction(() => {
    const appViews = appsStore.appViews[id]
    return appViews[viewName]
  })
}
