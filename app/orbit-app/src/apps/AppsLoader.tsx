import { AppsStore, AppStore, ProvideStores, useAppPackage } from '@mcro/kit'
import { useStoreSimple } from '@mcro/use-store'
import { isEqual } from 'lodash'
import React, { memo, useEffect, useMemo, useRef } from 'react'

type AppsLoaderProps = {
  children?: any
  apps: { id: string; type: string }[]
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
      for (const { type } of props.apps) {
        appsStore.setAppDefinition(type, useAppPackage(type).app)
      }
    },
    [props.apps],
  )

  const appViews = stableKeys.current.map(id => {
    const view = props.apps.find(view => view.id === id)
    return <AppLoader key={id} id={id} type={view.type} store={appsStore} />
  })

  return (
    <ProvideStores stores={{ appsStore }}>
      {appViews}
      {props.children}
    </ProvideStores>
  )
})

type AppLoaderProps = { id: string; type: string; store: AppsStore }

function AppLoader(props: AppLoaderProps) {
  const appDefinition = useAppPackage(props.type)

  if (!appDefinition.app.app) {
    console.warn(`App doesnt have a view ${props.type}`)
  }

  // never run more than once
  return useMemo(() => {
    // sub-view so we can use hooks
    return <AppLoadView {...props} />
  }, [])
}

function AppLoadView({ id, type, store }: AppLoaderProps) {
  // const { appsStore } = useStoresSimple()
  const appDefinition = useAppPackage(type)

  if (!appDefinition.app) {
    throw new Error(`Invalid definition ${id} ${type}`)
  }

  const AppView = appDefinition.app.app
  const appViewProps = { id }
  const appStore = useStoreSimple(AppStore, appViewProps)

  useEffect(() => {
    console.warn('!TODO we can load settings view here')
    // if (AppView.settings) {
    //   appsStore.addSettingsView(id, AppView.settings)
    // }
    store.handleAppStore(id, appStore)
  }, [])

  if (typeof AppView === 'function') {
    return (
      <ProvideStores stores={{ appStore }}>
        <AppView {...appViewProps} appStore={appStore} />
      </ProvideStores>
    )
  }
}
