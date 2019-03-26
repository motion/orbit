import {
  AppDefinition,
  AppStore,
  AppViewsContext,
  getAppDefinition,
  ProvideStores,
  AppLoadContext
} from '@o/kit'
import { Loading, SelectionStore, useOnMount, Visibility } from '@o/ui'
import { useReaction, useStoreSimple } from '@o/use-store'
import React, { memo, Suspense, useCallback } from 'react'
import '../../apps/orbitApps'
import { useAppLocationEffect } from '../../effects/useAppLocationEffect'
import { useStoresSimple } from '../../hooks/useStores'
import { OrbitMain } from './OrbitMain'
import { OrbitSidebar } from './OrbitSidebar'
import { OrbitStatusBar } from './OrbitStatusBar'
import { OrbitToolBar } from './OrbitToolBar'

export const OrbitApp = ({ id, identifier }: { id: string; identifier: string }) => {
  const { orbitStore, paneManagerStore } = useStoresSimple()
  const getIsActive = () => paneManagerStore.activePane && paneManagerStore.activePane.id === id
  const visible = useReaction(getIsActive)
  const isActive = useCallback(getIsActive, [])
  const appStore = useStoreSimple(AppStore, { id, identifier, isActive })
  const selectionStore = useStoreSimple(SelectionStore, { isActive: useReaction(getIsActive) })

  // set default initial appProps
  useOnMount(function setInitialConfig() {
    orbitStore.setActiveConfig(id, {
      identifier,
    })
  })

  return (
    <ProvideStores stores={{ selectionStore, appStore }}>
      <Visibility visible={visible}>
        <OrbitAppRender id={id} identifier={identifier} />
      </Visibility>
    </ProvideStores>
  )
}

const OrbitAppRender = memo(({ id, identifier }: { id: string; identifier: string }) => {
  // handle url changes
  useAppLocationEffect()

  const appDef = getAppDefinition(identifier)

  if (appDef.app == null) {
    console.debug('no app', id, identifier)
    return null
  }

  return <OrbitAppRenderOfDefinition appDef={appDef} id={id} identifier={identifier} />
})

export const OrbitAppRenderOfDefinition = ({
  id,
  identifier,
  appDef,
}: {
  id: string
  identifier: string
  appDef: AppDefinition
}) => {
  const { app: App } = appDef
  const Toolbar = OrbitToolBar
  const Sidebar = OrbitSidebar
  const Main = OrbitMain
  const Statusbar = OrbitStatusBar

  return (
    <Suspense fallback={<Loading />}>
      <AppLoadContext.Provider value={{ id, identifier, appDef }}>
        <AppViewsContext.Provider value={{ Toolbar, Sidebar, Main, Statusbar }}>
          <App />
        </AppViewsContext.Provider>
      </AppLoadContext.Provider>
    </Suspense>
  )
}

if (module['hot']) {
  module['hot'].accept()
}
