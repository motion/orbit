import { AppLoadContext, AppsStore, AppStore, ProvideStores, useAppPackage } from '@mcro/kit'
import { MergeContext } from '@mcro/ui'
import { useStoreSimple } from '@mcro/use-store'
import { isEqual } from 'lodash'
import React, { memo, useEffect, useMemo, useRef } from 'react'

type AppsLoaderProps = {
  children?: any
  apps: { id: string; appId: string }[]
}

export const AppsLoader = memo(function AppsLoader(props: AppsLoaderProps) {
  const appsStore = useStoreSimple(AppsStore)
  const stableKeys = useRef([])
  const sortedKeys = new Set(props.apps.map(v => v.id).sort())
  if (!isEqual(new Set(stableKeys.current), sortedKeys)) {
    // we are building this up over time, so once we see an id
    // we always show it in the same order in the DOM
    stableKeys.current = [...new Set([...stableKeys.current, ...sortedKeys])].filter(id =>
      props.apps.find(x => x.id === id),
    )
  }

  // a little weird
  useEffect(
    () => {
      for (const { appId } of props.apps) {
        appsStore.setAppDefinition(appId, useAppPackage(appId).app)
      }
    },
    [props.apps],
  )

  const appViews = stableKeys.current.map(id => {
    const view = props.apps.find(view => view.id === id)
    return <AppLoader key={id} id={id} appId={view.appId} store={appsStore} />
  })

  return (
    <ProvideStores stores={{ appsStore }}>
      {appViews}
      {props.children}
    </ProvideStores>
  )
})

type AppLoaderProps = { id: string; appId: string; store: AppsStore }

// never run more than once
function AppLoader(props: AppLoaderProps) {
  return useMemo(() => {
    return <AppLoadView {...props} />
  }, [])
}

function AppLoadView({ id, appId, store }: AppLoaderProps) {
  const appDefinition = useAppPackage(appId)
  // this is the <App index={} /> view inside that app...
  const AppApp = appDefinition.app.app as any
  const appViewProps = { id }
  const appStore = useStoreSimple(AppStore, appViewProps)

  useEffect(() => {
    // if (AppView.settings) {
    //   appsStore.addSettingsView(id, AppView.settings)
    // }
    store.setAppStore(id, appStore)
  }, [])

  if (typeof AppApp === 'function') {
    return (
      <ProvideStores stores={{ appStore }}>
        <MergeContext Context={AppLoadContext} value={{ appId, id }}>
          <AppApp {...appViewProps} appStore={appStore} />
        </MergeContext>
      </ProvideStores>
    )
  } else {
    console.warn('no app view...', appId, appDefinition)
    return null
  }
}
