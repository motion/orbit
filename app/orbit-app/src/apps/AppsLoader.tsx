import { useStore } from '@mcro/use-store'
import React, { useEffect, useMemo } from 'react'
import { ProvideStores } from '../components/ProvideStores'
import { apps } from './apps'
import { AppsStore } from './AppsStore'
import { AppStore } from './AppStore'

type AppViewDefinition = { id: string; type: string }

export default function AppsLoader(props: { children?: any; views: AppViewDefinition[] }) {
  const appsStore = useStore(AppsStore)

  const appLoadViews = props.views.map(view => {
    return <AppLoader key={view.id} id={view.id} type={view.type} store={appsStore} />
  })

  return (
    <ProvideStores stores={{ appsStore }}>
      {appLoadViews}
      {props.children}
    </ProvideStores>
  )
}

type AppLoaderProps = { id: string; type: string; store: AppsStore }

function AppLoader(props: AppLoaderProps) {
  const AppView = apps[props.type]

  if (!AppView) {
    throw new Error(`App not found ${props.type}`)
  }

  // never run more than once
  // sub-view so we can use hooks
  const element = useMemo(() => {
    return <AppLoadView {...props} />
  }, [])

  return element
}

function AppLoadView({ id, type, store }: AppLoaderProps) {
  const AppView = apps[type]
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
