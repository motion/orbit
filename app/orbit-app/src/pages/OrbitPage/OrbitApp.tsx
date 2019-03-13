import { AppLoadContext, AppStore, AppViewsContext, getAppDefinition, ProvideStores } from '@o/kit'
import { useOnMount } from '@o/ui'
import { useStoreSimple } from '@o/use-store'
import React, { useCallback } from 'react'
import '../../apps/orbitApps'
import { useAppLocationEffect } from '../../effects/useAppLocationEffect'
import { useStoresSimple } from '../../hooks/useStores'
import { OrbitMain } from './OrbitMain'
import { OrbitSidebar } from './OrbitSidebar'
import { OrbitStatusBar } from './OrbitStatusBar'
import { OrbitToolBar } from './OrbitToolBar'

export const OrbitApp = ({ id, identifier }) => {
  const { orbitStore, paneManagerStore } = useStoresSimple()
  const isActive = useCallback(
    () => paneManagerStore.activePane && paneManagerStore.activePane.id === id,
    [],
  )
  const appStore = useStoreSimple(AppStore, { id, identifier, isActive })
  // console.log('create app', id, identifier)
  // const selectionStore = useStoreSimple(SelectionStore, { isActive: isActive() })

  // set default initial appProps
  useOnMount(function setInitialConfig() {
    orbitStore.setActiveConfig(id, {
      identifier,
    })
  })

  return (
    <ProvideStores stores={{ /* selectionStore, */ appStore }}>
      <OrbitAppRender id={id} identifier={identifier} />
    </ProvideStores>
  )
}

function OrbitAppRender({ id, identifier }) {
  // handle url changes
  useAppLocationEffect()

  const { app } = getAppDefinition(identifier)

  if (!app) {
    console.debug('no app', id, identifier)
    return null
  }

  const App = app
  const Toolbar = OrbitToolBar
  const Sidebar = OrbitSidebar
  const Main = OrbitMain
  const Statusbar = OrbitStatusBar

  return (
    <AppLoadContext.Provider value={{ id, identifier }}>
      <AppViewsContext.Provider value={{ Toolbar, Sidebar, Main, Statusbar }}>
        <App />
      </AppViewsContext.Provider>
    </AppLoadContext.Provider>
  )
}

if (module['hot']) {
  module['hot'].accept()
}
