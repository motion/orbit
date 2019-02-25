import { isEqual } from '@mcro/fast-compare'
import { gloss, View, ViewProps } from '@mcro/gloss'
import {
  defaultPanes,
  getIsTorn,
  getPanes,
  PaneManagerStore,
  ProvideStores,
  QueryStore,
  settingsPane,
  SettingStore,
  showConfirmDialog,
  SpaceStore,
  ThemeStore,
  useActiveSources,
  useStoresSimple,
} from '@mcro/kit'
import { App, Electron } from '@mcro/stores'
import { Theme } from '@mcro/ui'
import { ensure, useReaction, useStore, useStoreSimple } from '@mcro/use-store'
import React, { memo, useEffect, useMemo, useRef } from 'react'
import { ActionsContext, defaultActions } from '../../actions/Actions'
import { AppActions } from '../../actions/appActions/AppActions'
import { AppsLoader } from '../../apps/AppsLoader'
import { orbitStaticApps } from '../../apps/orbitApps'
import MainShortcutHandler from '../../components/shortcutHandlers/MainShortcutHandler'
import { APP_ID } from '../../constants'
import { useActions } from '../../hooks/useActions'
import { useManagePaneSort } from '../../hooks/useManagePaneSort'
import { useStores } from '../../hooks/useStores'
import { HeaderStore } from '../../stores/HeaderStore'
import { NewAppStore } from '../../stores/NewAppStore'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { AppWrapper } from '../../views'
import { OrbitHeader } from './OrbitHeader'
import { OrbitMain } from './OrbitMain'
import OrbitSidebar, { SidebarStore } from './OrbitSidebar'
import { OrbitStatusBar } from './OrbitStatusBar'
import { OrbitStore } from './OrbitStore'
import { OrbitToolBar } from './OrbitToolBar'

export default memo(function OrbitPage() {
  const themeStore = useStore(ThemeStore)

  log('rendering orbit page root')

  return (
    <ProvideStores stores={{ themeStore }}>
      <Theme name={themeStore.themeColor}>
        <AppWrapper className={`theme-${themeStore.themeColor} app-parent-bounds`}>
          <ActionsContext.Provider value={defaultActions}>
            <OrbitPageProvideStores>
              <OrbitPageInner />
              <OrbitManagers />
            </OrbitPageProvideStores>
          </ActionsContext.Provider>
        </AppWrapper>
      </Theme>
    </ProvideStores>
  )
})

function useManageQuerySources() {
  const { queryStore } = useStoresSimple()
  const activeSources = useActiveSources()
  useEffect(
    () => {
      // TODO @umed type
      queryStore.setSources(activeSources as any[])
    },
    [activeSources],
  )
}

function useManagePanes() {
  const Actions = useActions()
  const { paneManagerStore, spaceStore } = useStores()

  useReaction(() => spaceStore.apps, function managePanes(apps) {
    ensure('apps', !!apps.length)
    const { panes, paneIndex } = getPanes(paneManagerStore, apps)
    if (!isEqual(panes, paneManagerStore.panes)) {
      paneManagerStore.setPanes(panes)
    }
    paneManagerStore.setPaneIndex(paneIndex)
    Actions.setInitialPaneIndex()
  })
}

function OrbitManagers() {
  useManagePanes()
  useManagePaneSort()
  useManageQuerySources()
  return null
}

const OrbitPageInner = memo(function OrbitPageInner() {
  const Actions = useActions()
  const { paneManagerStore } = useStores()
  const orbitStore = useStore(OrbitStore)
  const headerStore = useStoreSimple(HeaderStore)
  const sidebarStore = useStoreSimple(SidebarStore)
  const shortcutState = useRef({
    closeTab: 0,
    closeApp: 0,
  })

  useEffect(() => {
    return App.onMessage(App.messages.TOGGLE_SETTINGS, () => {
      AppActions.setOrbitDocked(true)
      paneManagerStore.setActivePaneByType('settings')
    })
  }, [])

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
          App.sendMessage(Electron, Electron.messages.CLOSE_APP, { appId: APP_ID })
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
    appId: pane.type,
  }))

  const staticApps = orbitStaticApps.map(app => ({
    id: app.id,
    appId: app.id,
  }))

  return (
    <ProvideStores stores={{ orbitStore, headerStore, sidebarStore }}>
      <MainShortcutHandler handlers={handlers}>
        <AppsLoader apps={[...activeApps, ...staticApps]}>
          <OrbitHeader />
          <InnerChrome torn={orbitStore.isTorn}>
            <OrbitToolBar />
            <OrbitContentArea>
              <OrbitSidebar />
              <OrbitMain />
            </OrbitContentArea>
            <OrbitStatusBar />
          </InnerChrome>
        </AppsLoader>
      </MainShortcutHandler>
    </ProvideStores>
  )
})

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
