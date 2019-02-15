import { gloss, View, ViewProps } from '@mcro/gloss'
import { App, Electron } from '@mcro/stores'
import { Theme } from '@mcro/ui'
import { useStore, useStoreSimple } from '@mcro/use-store'
import React, { memo, useEffect, useRef } from 'react'
import { ActionsContext, defaultActions } from '../../actions/Actions'
import { AppActions } from '../../actions/AppActions'
import { AppsLoader } from '../../apps/AppsLoader'
import { ProvideStores } from '../../components/ProvideStores'
import MainShortcutHandler from '../../components/shortcutHandlers/MainShortcutHandler'
import { APP_ID } from '../../constants'
import { showConfirmDialog } from '../../helpers/electron/showConfirmDialog'
import { getIsTorn } from '../../helpers/getAppHelpers'
import { useManagePaneSort } from '../../hooks/useManagePaneSort'
import { useStores } from '../../hooks/useStores'
import { defaultPanes, settingsPane } from '../../stores/getPanes'
import { HeaderStore } from '../../stores/HeaderStore'
import { NewAppStore } from '../../stores/NewAppStore'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SettingStore } from '../../stores/SettingStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { SpaceStore } from '../../stores/SpaceStore'
import { ThemeStore } from '../../stores/ThemeStore'
import { AppWrapper } from '../../views'
import OrbitHeader from './OrbitHeader'
import OrbitMain from './OrbitMain'
import OrbitSidebar, { SidebarStore } from './OrbitSidebar'
import OrbitStatusBar from './OrbitStatusBar'
import { OrbitStore } from './OrbitStore'
import OrbitToolBar from './OrbitToolBar'

export default memo(function OrbitPage() {
  const themeStore = useStore(ThemeStore)

  return (
    <ProvideStores stores={{ themeStore }}>
      <Theme name={themeStore.theme}>
        <AppWrapper className={`theme-${themeStore.theme} app-parent-bounds`}>
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

function OrbitManagers() {
  useManagePaneSort()
  return null
}

const OrbitPageInner = memo(function OrbitPageInner() {
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

  const allViews = paneManagerStore.panes.map(pane => ({
    id: pane.id,
    type: pane.type,
  }))

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
    <ProvideStores stores={{ orbitStore, headerStore, sidebarStore }}>
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
}).theme((_, theme) => ({
  background: theme.sidebarBackground,
}))

function OrbitPageProvideStores(props: any) {
  const settingStore = useStoreSimple(SettingStore)
  const sourcesStore = useStoreSimple(SourcesStore)
  const queryStore = useStoreSimple(QueryStore, { sourcesStore })
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
