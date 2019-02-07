import { AppBit } from '@mcro/models'
import { useStore } from '@mcro/use-store'
import React, { useMemo } from 'react'
import { StoreContext } from '../contexts'
import { useActiveApps } from '../hooks/useActiveApps'
import { MergeContext } from '../views/MergeContext'
import { apps } from './apps'
import { AppStore } from './AppStore'
import { AppViews } from './AppTypes'

export class AppsStore {
  appViews: { [key: number]: AppViews } = {}

  handleAppViews = (id: number, views: AppViews) => {
    this.appViews = {
      ...this.appViews,
      [id]: views,
    }
  }
}

export default function AppsLoader(props: { children?: any }) {
  const appsStore = useStore(AppsStore)
  const activeApps = useActiveApps()

  const appLoadViews = activeApps.map(app => {
    return <AppLoader key={app.id} app={app} store={appsStore} />
  })

  return (
    <MergeContext Context={StoreContext} value={{ appsStore }}>
      {appLoadViews}
      {props.children}
    </MergeContext>
  )
}

type AppLoaderProps = { app: AppBit; store: AppsStore }

function AppLoader(props: AppLoaderProps) {
  const AppView = apps[props.app.type]

  if (!AppView) {
    throw new Error(`App not found ${props.app.type}`)
  }

  // never run more than once
  const element = useMemo(() => {
    // functional app
    if (typeof AppView === 'function') {
      return <AppLoadDynamicView {...props} />
    }

    // legacy
    if (AppView.index || AppView.main) {
      props.store.handleAppViews(props.app.id, AppView)
      return null
    } else {
      throw new Error(`Invalid definition ${AppView}`)
    }
  }, [])

  return element
}

function AppLoadDynamicView({ app }: AppLoaderProps) {
  const AppView = apps[app.type]
  const appViewProps = { id: `${app.id}` }
  const appStore = useStore(AppStore, appViewProps)

  if (typeof AppView === 'function') {
    return (
      <MergeContext Context={StoreContext} value={{ appStore }}>
        <AppView {...appViewProps} appStore={appStore} />
      </MergeContext>
    )
  }

  // should never get here just for typscript
  console.warn('weird')
  return null
}
