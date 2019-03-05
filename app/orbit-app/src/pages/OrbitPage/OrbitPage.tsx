import { command } from '@mcro/bridge'
import { isEqual } from '@mcro/fast-compare'
import { gloss, View, ViewProps } from '@mcro/gloss'
import {
  AppLoadContext,
  AppStore,
  AppViewsContext,
  getAppDefinition,
  PaneManagerStore,
  ProvideStores,
  QueryStore,
  SettingStore,
  showConfirmDialog,
  SpaceStore,
  ThemeStore,
  useActiveSyncApps,
  useIsAppActive,
} from '@mcro/kit'
import { CloseAppCommand } from '@mcro/models'
import { SelectionStore, Theme } from '@mcro/ui'
import { useStore, useStoreSimple } from '@mcro/use-store'
import React, { memo, useEffect, useMemo, useRef } from 'react'
import { ActionsContext, defaultActions } from '../../actions/Actions'
import { orbitStaticApps } from '../../apps/orbitApps'
import MainShortcutHandler from '../../components/shortcutHandlers/MainShortcutHandler'
import { APP_ID } from '../../constants'
import { usePaneManagerEffects } from '../../effects/paneManagerEffects'
import { defaultPanes, settingsPane } from '../../effects/paneManagerStoreUpdatePanes'
import { useAppLocationEffects } from '../../effects/useAppLocationEffects'
import { useUserEffects } from '../../effects/userEffects'
import { getIsTorn } from '../../helpers/getIsTorn'
import { useActions } from '../../hooks/useActions'
import { useMessageHandlers } from '../../hooks/useMessageHandlers'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import { HeaderStore } from '../../stores/HeaderStore'
import { LocationStore } from '../../stores/LocationStore'
import { NewAppStore } from '../../stores/NewAppStore'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { AppWrapper } from '../../views'
import { OrbitHeader } from './OrbitHeader'
import { OrbitMain } from './OrbitMain'
import { OrbitSidebar } from './OrbitSidebar'
import { OrbitStatusBar } from './OrbitStatusBar'
import { OrbitStore } from './OrbitStore'
import { OrbitToolBar } from './OrbitToolBar'

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
              <OrbitStoreEffects />
            </OrbitPageProvideStores>
          </ActionsContext.Provider>
        </AppWrapper>
      </Theme>
    </ProvideStores>
  )
})

function useManageQuerySources() {
  const { queryStore } = useStoresSimple()
  const syncApps = useActiveSyncApps()
  useEffect(
    () => {
      queryStore.setSources(
        syncApps.map(x => ({
          name: x.name,
          type: x.identifier,
        })),
      )
    },
    [syncApps],
  )
}

function OrbitStoreEffects() {
  usePaneManagerEffects()
  useUserEffects()
  useManageQuerySources()
  useMessageHandlers()
  return null
}

function useStableSort<A extends string>(ids: A[]): A[] {
  const stableKeys = useRef<A[]>([])
  const sortedIds = [...ids].sort()

  if (!isEqual(stableKeys.current.sort(), sortedIds)) {
    // we are building this up over time, so once we see an id
    // we always show it in the same order in the DOM
    const next = [...new Set([...stableKeys.current, ...sortedIds])]
    stableKeys.current = next
  }

  return stableKeys.current
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

      if (orbitStore.isTorn) {
        // TORN AWAY APP
        if (shouldCloseApp || shouldCloseTab) {
          e.returnValue = false
          command(CloseAppCommand, { appId: APP_ID })
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

  const staticApps = orbitStaticApps.map(app => ({
    id: app.id,
    identifier: app.id,
  }))

  const allApps = [...activeApps, ...staticApps]

  const stableSortedApps = useStableSort(allApps.map(x => x.id)).map(id =>
    allApps.find(x => x.id === id),
  )

  return (
    <ProvideStores stores={{ orbitStore, headerStore }}>
      <MainShortcutHandler handlers={handlers}>
        <OrbitHeader />
        <InnerChrome torn={orbitStore.isTorn}>
          <OrbitContentArea>
            {stableSortedApps.map(app => (
              <OrbitApp key={app.id} id={app.id} identifier={app.identifier} />
            ))}
          </OrbitContentArea>
        </InnerChrome>
      </MainShortcutHandler>
    </ProvideStores>
  )
})

const OrbitApp = ({ id, identifier }) => {
  const appStore = useStoreSimple(AppStore, { id })
  const isActive = useIsAppActive()
  const selectionStore = useStoreSimple(SelectionStore, { isActive })
  return (
    <ProvideStores stores={{ selectionStore, appStore }}>
      <OrbitAppRender id={id} identifier={identifier} />
    </ProvideStores>
  )
}

function OrbitAppRender({ id, identifier }) {
  const { app } = getAppDefinition(identifier)

  if (!app) {
    console.warn('no app')
    return null
  }

  const App = app
  const Toolbar = OrbitToolBar
  const Sidebar = OrbitSidebar
  const Main = OrbitMain
  const Statusbar = OrbitStatusBar

  // handle url changes
  useAppLocationEffects()

  return (
    <AppLoadContext.Provider value={{ id, identifier }}>
      <AppViewsContext.Provider value={{ Toolbar, Sidebar, Main, Statusbar }}>
        <App />
      </AppViewsContext.Provider>
    </AppLoadContext.Provider>
  )
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
  const settingStore = useStoreSimple(SettingStore)
  const queryStore = useStoreSimple(QueryStore)
  const orbitWindowStore = useStoreSimple(OrbitWindowStore, { queryStore })
  const newAppStore = useStoreSimple(NewAppStore)

  const paneManagerStore = useStoreSimple(PaneManagerStore, {
    defaultPanes: getIsTorn() ? [settingsPane] : defaultPanes,
    defaultIndex: 0,
    onPaneChange(index: number) {
      orbitWindowStore.activePaneIndex = index
    },
  })

  const spaceStore = useStoreSimple(SpaceStore, { paneManagerStore })

  const stores = {
    settingStore,
    orbitWindowStore,
    spaceStore,
    queryStore,
    paneManagerStore,
    newAppStore,
  }

  return <ProvideStores stores={stores}>{props.children}</ProvideStores>
}

const InnerChrome = gloss<{ torn?: boolean } & ViewProps>(View, {
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1,
}).theme(({ torn }) => ({
  boxShadow: [torn ? null : [0, 0, 80, [0, 0, 0, 0.05]]],
}))
