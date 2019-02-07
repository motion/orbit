import { AppBit } from '@mcro/models'
import { useStore } from '@mcro/use-store'
import React, { memo } from 'react'
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

const AppLoader = memo(
  function AppLoader({ app, store }: { app: AppBit; store: AppsStore }) {
    const AppView = apps[app.type]

    if (!AppView) {
      throw new Error(`App not found ${app.type}`)
    }

    if (typeof AppView === 'function') {
      const appStore = useStore(AppStore, { id: `${app.id}` })

      return (
        <MergeContext Context={StoreContext} value={{ appStore }}>
          <AppView appStore={appStore} />
        </MergeContext>
      )
    }

    if (AppView.index || AppView.main) {
      store.handleAppViews(app.id, AppView)
    } else {
      throw new Error(`Invalid definition ${AppView}`)
    }

    console.log('waht?', AppView)
    return null
  },
  // NEVER re-render this component
  () => true,
)
