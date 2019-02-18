import { useStore, useStoreSimple } from '@mcro/use-store'
import React, { memo, useEffect, useMemo } from 'react'
import { ProvideStores } from '../components/ProvideStores'
import { apps } from './apps'
import { appsStatic } from './appsStatic'
import { AppsStore } from './AppsStore'
import { AppStore } from './AppStore'

type AppViewDefinition = { id: string; type: string }

export const AppsLoader = memo(function AppsLoader(props: {
  children?: any
  views: AppViewDefinition[]
}) {
  const appsStore = useStoreSimple(AppsStore)

  const appViews = props.views.map(view => {
    return <AppLoader key={view.id} id={view.id} type={view.type} store={appsStore} />
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
  return apps[type] || appsStatic[type]
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
  const AppView = getAppViews(type)
  const appViewProps = { id }
  const appStore = useStore(AppStore, appViewProps)

  useEffect(() => {
    if (typeof AppView !== 'function') {
      if (AppView.index || AppView.main) {
        store.setupApp(id, AppView)
      }
    }

    store.handleAppStore(id, appStore)
  }, [])

  if (typeof AppView === 'function') {
    return (
      <ProvideStores stores={{ appStore }}>
        <AppView {...appViewProps} appStore={appStore} />
      </ProvideStores>
    )
  }

  if (AppView.index || AppView.main) {
    return null
  } else {
    throw new Error(`Invalid definition ${AppView}`)
  }
}
