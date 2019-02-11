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
    return <AppLoader key={view.id} view={view} store={appsStore} />
  })

  return (
    <ProvideStores stores={{ appsStore }}>
      {appLoadViews}
      {props.children}
    </ProvideStores>
  )
}

type AppLoaderProps = { view: AppViewDefinition; store: AppsStore }

function AppLoader(props: AppLoaderProps) {
  const AppView = apps[props.view.type]

  if (!AppView) {
    throw new Error(`App not found ${props.view.type}`)
  }

  // never run more than once
  // sub-view so we can use hooks
  const element = useMemo(() => <AppLoadView {...props} />, [])

  return element
}

function AppLoadView({ view, store }: AppLoaderProps) {
  const AppView = apps[view.type]
  const appViewProps = { id: view.id }
  const appStore = useStore(AppStore, appViewProps)

  useEffect(() => {
    store.handleAppStore(view.id, appStore)
  })

  if (typeof AppView === 'function') {
    return (
      <ProvideStores stores={{ appStore }}>
        <AppView {...appViewProps} appStore={appStore} />
      </ProvideStores>
    )
  }

  if (AppView.index || AppView.main) {
    store.handleAppViews(view.id, AppView)
    return null
  } else {
    throw new Error(`Invalid definition ${AppView}`)
  }
}
