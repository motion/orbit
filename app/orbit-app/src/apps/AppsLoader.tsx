import { AppLoadContext, AppsStore, AppStore, getAppDefinition, ProvideStores } from '@mcro/kit'
import { MergeContext } from '@mcro/ui'
import { useStoreSimple } from '@mcro/use-store'
import { isEqual } from 'lodash'
import React, { memo, useEffect, useMemo, useRef } from 'react'

type AppsLoaderProps = {
  children?: any
  apps: { id: string; identifier: string }[]
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
      for (const { identifier } of props.apps) {
        appsStore.setAppDefinition(identifier, getAppDefinition(identifier))
      }
    },
    [props.apps],
  )

  const appViews = stableKeys.current.map(id => {
    const view = props.apps.find(view => view.id === id)
    return <AppLoader key={id} id={id} identifier={view.identifier} store={appsStore} />
  })

  return (
    <ProvideStores stores={{ appsStore }}>
      {appViews}
      {props.children}
    </ProvideStores>
  )
})

type AppLoaderProps = { id: string; identifier: string; store: AppsStore }

// never run more than once
function AppLoader(props: AppLoaderProps) {
  return useMemo(() => {
    return <AppLoadView {...props} />
  }, [])
}

function AppLoadView({ id, identifier, store }: AppLoaderProps) {
  const appDefinition = getAppDefinition(identifier)
  const appAppRef = useRef(appDefinition.app)
  const AppApp = appAppRef.current
  const appViewProps = { id, identifier }
  const appStore = useStoreSimple(AppStore, appViewProps)

  useEffect(() => {
    if (!AppApp) return
    store.setAppStore(id, appStore)
  }, [])

  if (!AppApp) {
    return null
  }

  if (typeof AppApp === 'function') {
    return (
      <ProvideStores stores={{ appStore }}>
        <MergeContext Context={AppLoadContext} value={{ identifier, id }}>
          <AppApp {...appViewProps} />
        </MergeContext>
      </ProvideStores>
    )
  } else {
    console.warn('no app view...', identifier, appDefinition)
    return null
  }
}
