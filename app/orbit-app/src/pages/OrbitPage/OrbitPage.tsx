import { command } from '@o/bridge'
import { gloss } from '@o/gloss'
import * as KIT from '@o/kit'
import {
  AppDefinition,
  LocationStore,
  PaneManagerStore,
  ProvideStores,
  QueryStore,
  showConfirmDialog,
  SpaceStore,
  ThemeStore,
} from '@o/kit'
import { CloseAppCommand } from '@o/models'
import { appStartupConfig, isEditing } from '@o/stores'
import * as UI from '@o/ui'
import { Loading, Theme } from '@o/ui'
import { useStore, useStoreSimple } from '@o/use-store'
import { keyBy } from 'lodash'
import React, { memo, Suspense, useEffect, useMemo, useRef } from 'react'
import * as ReactDOM from 'react-dom'
import { ActionsContext, defaultActions } from '../../actions/Actions'
import { getApps, orbitApps } from '../../apps/orbitApps'
import MainShortcutHandler from '../../components/shortcutHandlers/MainShortcutHandler'
import { usePaneManagerEffects } from '../../effects/paneManagerEffects'
import { defaultPanes, settingsPane } from '../../effects/paneManagerStoreUpdatePanes'
import { querySourcesEffect } from '../../effects/querySourcesEffect'
import { useEnsureApps } from '../../effects/useEnsureApps'
import { useUserEffects } from '../../effects/userEffects'
import { useStableSort } from '../../hooks/pureHooks/useStableSort'
import { useActions } from '../../hooks/useActions'
import { useMessageHandlers } from '../../hooks/useMessageHandlers'
import { useStores } from '../../hooks/useStores'
import { HeaderStore } from '../../stores/HeaderStore'
import { NewAppStore } from '../../stores/NewAppStore'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { AppWrapper } from '../../views'
import { LoadApp } from './LoadApp'
import { OrbitApp, OrbitAppRenderOfDefinition } from './OrbitApp'
import { OrbitFloatingShareCard } from './OrbitFloatingShareCard'
import { OrbitHeader } from './OrbitHeader'
import { OrbitStore } from './OrbitStore'

window['React'] = (window as any).React = React
window['ReactDOM'] = (window as any).ReactDOM = ReactDOM
window['OrbitKit'] = (window as any).OrbitUI = KIT
window['OrbitUI'] = (window as any).OrbitUI = UI

export const OrbitPage = memo(() => {
  const themeStore = useStore(ThemeStore)
  const locationStore = useStore(LocationStore)
  return (
    <ProvideStores stores={{ locationStore, themeStore }}>
      <Theme name={themeStore.themeColor}>
        <AppWrapper className={`theme-${themeStore.themeColor} app-parent-bounds`}>
          <ActionsContext.Provider value={defaultActions}>
            <OrbitPageProvideStores>
              <OrbitPageInner />
              {/* Inside provide stores to capture all our relevant stores */}
              <OrbitEffects />
            </OrbitPageProvideStores>
          </ActionsContext.Provider>
        </AppWrapper>
      </Theme>
    </ProvideStores>
  )
})

function OrbitEffects() {
  usePaneManagerEffects()
  useUserEffects()
  querySourcesEffect()
  useMessageHandlers()
  useEnsureApps()
  return null
}

const OrbitPageInner = memo(function OrbitPageInner() {
  const Actions = useActions()
  const { paneManagerStore } = useStores()
  const orbitStore = useStore(OrbitStore)
  const headerStore = useStoreSimple(HeaderStore)
  const shortcutState = useRef({
    closeTab: 0,
    closeApp: 0,
  })

  useEffect(() => {
    // prevent close on the main window
    window.onbeforeunload = function(e) {
      const { closeTab, closeApp } = shortcutState.current
      const shouldCloseTab = Date.now() - closeTab < 60
      const shouldCloseApp = Date.now() - closeApp < 60

      console.log('unloading!', shouldCloseApp, shouldCloseTab)

      if (isEditing) {
        if (shouldCloseApp || shouldCloseTab) {
          e.returnValue = false
          command(CloseAppCommand, { appId: appStartupConfig.appId })
          return
        }
      } else {
        // MAIN APP
        // prevent on command+w
        if (shouldCloseTab) {
          e.returnValue = false
          Actions.previousTab()
          return
        }
        if (shouldCloseApp) {
          if (
            showConfirmDialog({
              title: 'Close Orbit?',
              message: 'This will close all sub-windows as well.',
            })
          ) {
            console.log('Bye all of orbit...')
          } else {
            e.returnValue = false
          }
        }
      }
    }
  }, [])

  const handlers = useMemo(() => {
    return {
      closeTab: () => {
        shortcutState.current.closeTab = Date.now()
      },
      closeApp: () => {
        shortcutState.current.closeApp = Date.now()
      },
    }
  }, [])

  const activeApps = paneManagerStore.panes.map(pane => ({
    id: pane.id,
    identifier: pane.type,
  }))
  const staticApps = orbitApps.map(app => ({
    id: app.id,
    identifier: app.id,
  }))

  const allApps = [...activeApps, ...staticApps]
  const appsWithViews = keyBy(getApps().filter(x => !!x.app), 'id')

  const stableSortedApps = useStableSort(allApps.map(x => x.id))
    .map(id => allApps.find(x => x.id === id))
    .filter(Boolean)

  let contentArea = null

  if (isEditing) {
    contentArea = (
      <Suspense fallback={<Loading />}>
        <LoadApp RenderApp={RenderApp} bundleURL={appStartupConfig.appInDev.bundleURL} />
      </Suspense>
    )
  } else {
    contentArea = stableSortedApps
      .filter(x => appsWithViews[x.identifier])
      .map(app => <OrbitApp key={app.id} id={app.id} identifier={app.identifier} />)
  }

  return (
    <ProvideStores stores={{ orbitStore, headerStore }}>
      <MainShortcutHandler handlers={handlers}>
        <OrbitHeader />
        <OrbitFloatingShareCard />
        <InnerChrome torn={orbitStore.isTorn}>
          <OrbitContentArea>{contentArea}</OrbitContentArea>
        </InnerChrome>
      </MainShortcutHandler>
    </ProvideStores>
  )
})

let RenderApp = ({ appDef }: { appDef: AppDefinition }) => {
  return <OrbitAppRenderOfDefinition appDef={appDef} id="6" identifier={appDef.id} />
}

const OrbitContentArea = gloss({
  flexFlow: 'row',
  flex: 1,
  transform: {
    z: 0,
  },
}).theme((_, theme) => ({
  background: theme.sidebarBackground,
}))

function OrbitPageProvideStores(props: any) {
  const queryStore = useStoreSimple(QueryStore)
  const orbitWindowStore = useStoreSimple(OrbitWindowStore, { queryStore })
  const newAppStore = useStoreSimple(NewAppStore)

  const paneManagerStore = useStoreSimple(PaneManagerStore, {
    defaultPanes: isEditing ? [settingsPane] : defaultPanes,
    defaultIndex: 0,
  })

  const spaceStore = useStoreSimple(SpaceStore, { paneManagerStore })

  const stores = {
    orbitWindowStore,
    spaceStore,
    queryStore,
    paneManagerStore,
    newAppStore,
  }

  return <ProvideStores stores={stores}>{props.children}</ProvideStores>
}

const InnerChrome = gloss<{ torn?: boolean } & UI.ViewProps>(UI.View, {
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1,
}).theme(({ torn }) => ({
  boxShadow: [torn ? null : [0, 0, 80, [0, 0, 0, 0.05]]],
}))
