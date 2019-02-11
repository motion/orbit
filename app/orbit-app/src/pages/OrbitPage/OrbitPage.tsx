import { gloss, View, ViewProps } from '@mcro/gloss'
import { AppBit } from '@mcro/models'
import { App, Electron } from '@mcro/stores'
import { Theme } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { isEqual, once, uniqBy } from 'lodash'
import { observer, useObserver } from 'mobx-react-lite'
import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
import { apps } from '../../apps/apps'
import AppsLoader from '../../apps/AppsLoader'
import MainShortcutHandler from '../../components/shortcutHandlers/MainShortcutHandler'
import { APP_ID } from '../../constants'
import { StoreContext } from '../../contexts'
import { showConfirmDialog } from '../../helpers/electron/showConfirmDialog'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { useManagePaneSort } from '../../hooks/useManagePaneSort'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { HeaderStore } from '../../stores/HeaderStore'
import { NewAppStore } from '../../stores/NewAppStore'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { Pane, PaneManagerStore } from '../../stores/PaneManagerStore'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SettingStore } from '../../stores/SettingStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { SpaceStore } from '../../stores/SpaceStore'
import { AppWrapper } from '../../views'
import { MergeContext } from '../../views/MergeContext'
import OrbitHeader from './OrbitHeader'
import OrbitMain from './OrbitMain'
import OrbitNav from './OrbitNav'
import OrbitSidebar from './OrbitSidebar'
import OrbitStatusBar from './OrbitStatusBar'
import { OrbitStore } from './OrbitStore'
import OrbitToolBar from './OrbitToolBar'

export default React.memo(function OrbitPage() {
  // keep activeSpace.paneSort in sync with activeApps
  useManagePaneSort()

  return (
    <OrbitPageProvideStores>
      <OrbitPageInner />
    </OrbitPageProvideStores>
  )
})

const OrbitPageInner = observer(function OrbitPageInner() {
  const { orbitWindowStore, paneManagerStore } = useStoresSafe()
  const headerStore = useStore(HeaderStore)
  const theme = App.state.isDark ? 'dark' : 'light'
  const shortcutState = React.useRef({
    closeTab: 0,
    closeApp: 0,
  })

  React.useEffect(() => {
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

  React.useEffect(() => {
    // prevent close on the main window
    window.onbeforeunload = function(e) {
      const { closeTab, closeApp } = shortcutState.current
      const shouldCloseTab = Date.now() - closeTab < 60
      const shouldCloseApp = Date.now() - closeApp < 60

      console.log('unloading!', orbitWindowStore.isTorn, shouldCloseApp, shouldCloseTab)

      if (orbitWindowStore.isTorn) {
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
    <MergeContext Context={StoreContext} value={{ headerStore }}>
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
        <Theme name={theme}>
          <AppWrapper className={`theme-${theme} app-parent-bounds`}>
            <AppsLoader views={allViews}>
              <OrbitHeaderContainer className="draggable" onMouseUp={headerStore.handleMouseUp}>
                <OrbitHeader />
                <OrbitNav />
                {/* above bottom below active tab */}
                {/* <BorderBottom zIndex={10000000} /> */}
              </OrbitHeaderContainer>
              <InnerChrome torn={orbitWindowStore.isTorn}>
                <OrbitToolBar />
                <OrbitContentArea>
                  <OrbitSidebar />
                  <OrbitMain />
                </OrbitContentArea>
                <OrbitStatusBar />
              </InnerChrome>
            </AppsLoader>
          </AppWrapper>
        </Theme>
      </MainShortcutHandler>
    </MergeContext>
  )
})

const OrbitContentArea = gloss({
  flexFlow: 'row',
  flex: 1,
}).theme((_, theme) => ({
  background: theme.sidebarBackground,
}))

const OrbitHeaderContainer = gloss(View, {
  position: 'relative',
  zIndex: 400,
}).theme((_, theme) => ({
  // borderBottom: [1, theme.borderColor],
  background: theme.headerBackground || theme.background.alpha(0.65),
}))

const settingsPane = {
  id: 'settings',
  name: 'Settings',
  type: 'settings',
  isHidden: true,
  keyable: true,
}

const defaultPanes: Pane[] = [
  { id: 'sources', name: 'Sources', type: 'sources', isHidden: true, keyable: true },
  { id: 'spaces', name: 'Spaces', type: 'spaces', isHidden: true, keyable: true },
  settingsPane,
  { id: 'apps', name: 'Apps', type: 'apps' },
  { id: 'createApp', name: 'Add app', type: 'createApp' },
  { id: 'onboard', name: 'Onboard', type: 'onboard' },
]

function useOnce(fn: Function, reset = []) {
  return React.useCallback(once(fn as any), reset)
}

function getPanes(orbitWindowStore: OrbitWindowStore, apps: AppBit[]): Pane[] {
  const { isTorn } = orbitWindowStore
  if (isTorn) {
    // torn window panes, remove the others besides active app + settings
    return [orbitWindowStore.lastActivePane, settingsPane]
  } else {
    const appPanes = apps.map(app => ({
      type: app.type,
      id: `${app.id}`,
      keyable: true,
      subType: 'app',
    }))
    return [...defaultPanes, ...appPanes]
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

  useObserver(() => {
    const next = getPanes(orbitWindowStore, activeApps)
    if (!isEqual(next, paneManagerStore.panes)) {
      paneManagerStore.setPanes(next)
    }
  })

  const paneManagerStore = useStore(PaneManagerStore, {
    defaultPanes,
    defaultIndex: orbitWindowStore.activePaneIndex,
    onPaneChange(index: number) {
      orbitWindowStore.activePaneIndex = index
    },
  })

  // keep this in sync
  useObserver(() => {
    orbitWindowStore.setLastActivePane(paneManagerStore.activePane)
  })

  const orbitStore = useStore(OrbitStore, { activePane: paneManagerStore.activePane })

  // move to first app pane on first run
  const hasLoadedApps = !!activeApps.length
  const setToFirstAppPane = useOnce(() => {
    paneManagerStore.setPaneIndex(defaultPanes.length)
  })
  React.useEffect(
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
    orbitStore,
  }

  return (
    <MergeContext Context={StoreContext} value={stores}>
      {props.children}
    </MergeContext>
  )
}

const InnerChrome = gloss<{ torn?: boolean } & ViewProps>(View, {
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1,
}).theme(({ torn }) => ({
  boxShadow: [torn ? null : [0, 0, 80, [0, 0, 0, 0.05]]],
}))
