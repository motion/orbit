import { allApps } from '@mcro/apps'
import { AppsStore, AppStore, ProvideStores } from '@mcro/kit'
import { useStoreSimple } from '@mcro/use-store'
import { isEqual } from 'lodash'
import React, { memo, useEffect, useMemo, useRef } from 'react'
import { useStoresSimple } from '../hooks/useStores'
import { apps } from './apps'
import { appsStatic } from './appsStatic'

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

function getAppViews(type: string) {
  return apps[type] || appsStatic[type] || allApps[type]
}

function AppLoader(props: AppLoaderProps) {
  const AppView = getAppViews(props.type)
  if (!AppView) {
    throw new Error(`App not found ${props.type}`)
  }
  return useMemo(() => {
    // never run more than once
    // sub-view so we can use hooks
    return <AppLoadView {...props} />
  }, [])
}

function AppLoadView({ id, type, store }: AppLoaderProps) {
  const { appsStore } = useStoresSimple()
  const AppView = getAppViews(type)
  const appViewProps = { id }
  const appStore = useStoreSimple(AppStore, appViewProps)

  useEffect(() => {
    if (typeof AppView !== 'function') {
      if (AppView.index || AppView.main) {
        store.setupApp(id, AppView)
      }
    }

    if (AppView.settings) {
      appsStore.addSettingsView(id, AppView.settings)
    }

    store.handleAppStore(id, appStore)
  }, [])

  console.log('AppView', AppView)

  const AppEntryView = AppView.default || AppView

  if (typeof AppEntryView === 'function') {
    return (
      <ProvideStores stores={{ appStore }}>
        <AppEntryView {...appViewProps} appStore={appStore} />
      </ProvideStores>
    )
  }

  if (AppView.index || AppView.main) {
    return null
  } else {
    throw new Error(`Invalid definition ${AppView}`)
  }
}
