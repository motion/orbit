import { AppDefinition, AppsStore, AppStore, ProvideStores } from '@mcro/kit'
import { useStoreSimple } from '@mcro/use-store'
import { isEqual } from 'lodash'
import React, { memo, useEffect, useMemo, useRef } from 'react'
import { orbitApps } from './orbitApps'

type AppViewDefinition = { id: string; type: string }
type AppsLoaderProps = {
  children?: any
  views: AppViewDefinition[]
}

export const AppsLoader = memo(function AppsLoader(props: AppsLoaderProps) {
  const appsStore = useStoreSimple(AppsStore)
  const stableKeys = useRef([])
  const sortedKeys = new Set(props.views.map(v => v.id).sort())

  if (!isEqual(new Set(stableKeys.current), sortedKeys)) {
    // we are building this up over time, so once we see an id
    // we always show it in the same order in the DOM
    stableKeys.current = [...new Set([...stableKeys.current, ...sortedKeys])].filter(id =>
      props.views.find(x => x.id === id),
    )
  }

  const appViews = stableKeys.current.map(id => {
    const view = props.views.find(view => view.id === id)
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

export function getAppDefinition(id: string): AppDefinition | null {
  console.log('find app', id)
  const module = orbitApps.find(app => app.id === id)
  return (module.app && module.app) || null
}

function AppLoader(props: AppLoaderProps) {
  const appDefinition = getAppDefinition(props.type)

  if (!appDefinition.app) {
    console.warn(`App doesnt have a view ${props.type}`)
  }

  return useMemo(() => {
    // never run more than once
    // sub-view so we can use hooks
    return <AppLoadView {...props} />
  }, [])
}

function AppLoadView({ id, type, store }: AppLoaderProps) {
  // const { appsStore } = useStoresSimple()
  const appDefinition = getAppDefinition(type)

  if (!appDefinition.app) {
    throw new Error(`Invalid definition ${id} ${type}`)
  }

  const AppView = appDefinition.app
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
