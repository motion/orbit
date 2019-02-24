import { useReaction } from '@mcro/use-store'
import { useState } from 'react'
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
  const [appsState, setAppsState] = useState({
    appStore: props.appStore || appStore || null,
    views: {},
    provideStores: null,
    definition: null,
  })

  useReaction(() => {
    const { appsState } = appsStore
    if (!appsState) return

    const { appStores, appViews, provideStores } = appsState

    setAppsState({
      definition: appsState.definitions[props.id] || null,
      appStore: props.appStore || appStore || appStores[props.id],
      views: appViews[props.id] || {},
      provideStores: provideStores[props.id] || null,
    })
  })

  return appsState
}
