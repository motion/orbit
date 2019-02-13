import { gloss, View, ViewProps } from '@mcro/gloss'
import { AppBit } from '@mcro/models'
import { App, Electron } from '@mcro/stores'
import { Theme } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { once, uniqBy } from 'lodash'
import { comparer } from 'mobx'
import { useObservable, useObserver } from 'mobx-react-lite'
import React, { memo, useCallback, useEffect, useRef } from 'react'
import { ActionsContext, defaultActions } from '../../actions/Actions'
import { AppActions } from '../../actions/AppActions'
import { apps } from '../../apps/apps'
import AppsLoader from '../../apps/AppsLoader'
import { ProvideStores } from '../../components/ProvideStores'
import MainShortcutHandler from '../../components/shortcutHandlers/MainShortcutHandler'
import { APP_ID } from '../../constants'
import { showConfirmDialog } from '../../helpers/electron/showConfirmDialog'
import { getAppState, getIsTorn } from '../../helpers/getAppHelpers'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { useManagePaneSort } from '../../hooks/useManagePaneSort'
import { useStores } from '../../hooks/useStores'
import { HeaderStore } from '../../stores/HeaderStore'
import { NewAppStore } from '../../stores/NewAppStore'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { Pane, PaneManagerStore } from '../../stores/PaneManagerStore'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SettingStore } from '../../stores/SettingStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { SpaceStore } from '../../stores/SpaceStore'
import { AppWrapper } from '../../views'
import OrbitHeader from './OrbitHeader'
import OrbitMain from './OrbitMain'
import OrbitSidebar from './OrbitSidebar'
import OrbitStatusBar from './OrbitStatusBar'
import { OrbitStore } from './OrbitStore'
import OrbitToolBar from './OrbitToolBar'

class ThemeStore {
  get theme() {
    return App.state.isDark ? 'dark' : 'light'
  }
}

export default memo(function OrbitPage() {
  const { theme } = useStore(ThemeStore)

  return (
    <Theme name={theme}>
      <AppWrapper className={`theme-${theme} app-parent-bounds`}>
        <ActionsContext.Provider value={defaultActions}>
          <OrbitPageProvideStores>
            <OrbitPageInner />
            <OrbitManagers />
          </OrbitPageProvideStores>
        </ActionsContext.Provider>
      </AppWrapper>
    </Theme>
  )
})

function useManagePanes() {
  const activeApps = useActiveAppsSorted()
  const { paneManagerStore } = useStores()
  const appsId = activeApps.map(x => x.id).join('')
  const appsState = useObservable({ ids: '' })

  // trigger observer... :/
  useEffect(
    () => {
      appsState.ids = appsId
    },
    [appsId],
  )

  // keeps pane index + panes in sync with apps
  useObserver(() => {
    appsState.ids // watch for changes in apps :/
    const { panes, paneIndex } = getPaneSettings(paneManagerStore, activeApps)
    if (!comparer.structural(panes, paneManagerStore.panes)) {
      paneManagerStore.setPanes(panes)
    }
    paneManagerStore.setPaneIndex(paneIndex)
  })
}

function OrbitManagers() {
  useManagePaneSort()
  useManagePanes()
  return null
}

const OrbitPageInner = memo(() => {
  const { paneManagerStore } = useStores()
  const headerStore = useStore(HeaderStore)
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

  const allViews = uniqBy(
    [
      ...paneManagerStore.panes.map(pane => ({
        id: pane.id,
        type: pane.type,
      })),
      ...Object.keys(apps).map(type => ({
        id: type,
        type,
      })),
    ],
    x => x.id,
  )

  useEffect(() => {
    // prevent close on the main window
    window.onbeforeunload = function(e) {
      const { closeTab, closeApp } = shortcutState.current
      const shouldCloseTab = Date.now() - closeTab < 60
      const shouldCloseApp = Date.now() - closeApp < 60

      console.log('unloading!', shouldCloseApp, shouldCloseTab)

      if (getIsTorn()) {
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

  return (
    <ProvideStores stores={{ headerStore }}>
      <ProvideOrbitStore>
        <MainShortcutHandler
          handlers={{
            closeTab: () => {
              shortcutState.current.closeTab = Date.now()
            },
            closeApp: () => {
              shortcutState.current.closeApp = Date.now()
            },
          }}
        >
          <AppsLoader views={allViews}>
            <OrbitHeader />
            <InnerChrome torn={getIsTorn()}>
              <OrbitToolBar />
              <OrbitContentArea>
                <OrbitSidebar />
                <OrbitMain />
              </OrbitContentArea>
              <OrbitStatusBar />
            </InnerChrome>
          </AppsLoader>
        </MainShortcutHandler>
      </ProvideOrbitStore>
    </ProvideStores>
  )
})

function ProvideOrbitStore(props: { children: any }) {
  const { paneManagerStore } = useStores()
  const orbitStore = useStore(OrbitStore, { activePane: paneManagerStore.activePane })
  return <ProvideStores stores={{ orbitStore }}>{props.children}</ProvideStores>
}

const OrbitContentArea = gloss({
  flexFlow: 'row',
  flex: 1,
}).theme((_, theme) => ({
  background: theme.sidebarBackground,
}))

const settingsPane = {
  id: 'settings',
  name: 'Settings',
  type: 'settings',
  isHidden: true,
  keyable: true,
}

export const defaultPanes: Pane[] = [
  { id: 'sources', name: 'Sources', type: 'sources', isHidden: true, keyable: true },
  { id: 'spaces', name: 'Spaces', type: 'spaces', isHidden: true, keyable: true },
  settingsPane,
  { id: 'apps', name: 'Apps', type: 'apps' },
  { id: 'createApp', name: 'Add app', type: 'createApp' },
  { id: 'onboard', name: 'Onboard', type: 'onboard' },
]

function useOnce(fn: Function, reset = []) {
  return useCallback(once(fn as any), reset)
}

function appToPane(app: AppBit): Pane {
  return {
    type: app.type,
    id: `${app.id}`,
    keyable: true,
    subType: 'app',
    name: app.name,
  }
}

function getPanes(apps: AppBit[]): Pane[] {
  const isTorn = getIsTorn()
  if (isTorn) {
    // torn window panes, remove the others besides active app + settings
    const appState = getAppState()
    const app = apps.find(app => +app.id === +appState.appId)
    if (!app) {
      console.warn(`No app found! ${JSON.stringify(appState)} ${JSON.stringify(apps)}`)
      return [settingsPane]
    }
    return [appToPane(app), settingsPane]
  } else {
    const appPanes = apps.map(appToPane)
    return [...defaultPanes, ...appPanes]
  }
}

function getPaneSettings(paneManagerStore: PaneManagerStore, apps: AppBit[]) {
  let paneIndex = 0
  const currentPaneId = paneManagerStore.activePane.id
  const panes = getPanes(apps)
  paneIndex = panes.findIndex(pane => pane.id === currentPaneId)
  // move left one tab if were removing current tab
  if (paneIndex === -1) {
    const prevPane = paneManagerStore.panes[paneManagerStore.paneIndex - 1]
    const prevIndex = prevPane
      ? paneManagerStore.panes.findIndex(pane => pane.id === prevPane.id)
      : 0
    paneIndex = prevIndex === -1 ? 0 : prevIndex
    console.warn('removing pane you are currently on! moving to a different one')
  }
  return {
    panes,
    paneIndex,
  }
}

function OrbitPageProvideStores(props: any) {
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const spaceStore = useStore(SpaceStore)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const orbitWindowStore = useStore(OrbitWindowStore, { queryStore })
  const activeApps = useActiveAppsSorted()
  const newAppStore = useStore(NewAppStore)

  const paneManagerStore = useStore(PaneManagerStore, {
    defaultPanes,
    defaultIndex: 0,
    onPaneChange(index: number) {
      orbitWindowStore.activePaneIndex = index
    },
  })

  // move to first app pane on first run
  const hasLoadedApps = !!activeApps.length
  const setToFirstAppPane = useOnce(() => {
    paneManagerStore.setPaneIndex(defaultPanes.length)
  })
  useEffect(
    () => {
      hasLoadedApps && setToFirstAppPane()
    },
    [hasLoadedApps],
  )

  const stores = {
    settingStore,
    sourcesStore,
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
