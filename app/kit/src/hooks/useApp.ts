import { isEqual } from '@mcro/fast-compare'
import { useReaction } from '@mcro/use-store'
import { useState } from 'react'
import { AppStore } from '../stores'
import { AppDefinition, AppViews } from '../types/AppDefinition'
import { useStoresSimple } from './useStores'

export function useApp(
  appId: string,
  id?: string,
): {
  views: AppViews
  appStore: AppStore
  provideStores: Object
  definition: AppDefinition
} {
  const { appsStore, appStore } = useStoresSimple()
  const [state, setState] = useState({
    appStore: appStore || null,
    views: {},
    provideStores: null,
    definition: null,
  })

  useReaction(() => {
    const { appsState } = appsStore
    if (appsState) {
      const { appStores, appViews, provideStores, definitions } = appsState
      const next = {
        // definition and views are static
        definition: definitions[appId] || null,
        views: appViews[appId] || {},
        // these are dynamic (per id) but we need to fix loading so falling back to appId for now
        appStore: appStore || appStores[id] || appStores[appId] || null,
        provideStores: provideStores[id] || provideStores[appId] || null,
      }
      if (!isEqual(state, next)) {
        setState(next)
      }
    }
  })

  return state
}
