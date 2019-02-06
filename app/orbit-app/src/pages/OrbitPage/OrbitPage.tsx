import { gloss, Row, View, ViewProps } from '@mcro/gloss'
import { App } from '@mcro/stores'
import { Theme } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { once } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
import { OrbitToolBarProvider } from '../../components/OrbitToolbar'
import MainShortcutHandler from '../../components/shortcutHandlers/MainShortcutHandler'
import { StoreContext } from '../../contexts'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { useManagePaneSort } from '../../hooks/useManagePaneSort'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { HeaderStore } from '../../stores/HeaderStore'
import { NewAppStore } from '../../stores/NewAppStore'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SearchStore } from '../../stores/SearchStore'
import { SettingStore } from '../../stores/SettingStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { SpaceStore } from '../../stores/SpaceStore'
import { AppWrapper } from '../../views'
import { MergeContext } from '../../views/MergeContext'
import OrbitControls from './OrbitControls'
import OrbitHeader from './OrbitHeader'
import OrbitContent from './OrbitMain'
import OrbitNav from './OrbitNav'
import OrbitSidebar from './OrbitSidebar'
import { OrbitStore } from './OrbitStore'

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
  const { paneManagerStore } = useStoresSafe()
  const searchStore = useStore(SearchStore, { paneManagerStore })
  const orbitStore = useStore(OrbitStore)
  const headerStore = useStore(HeaderStore)
  const theme = App.state.isDark ? 'dark' : 'light'

  React.useEffect(() => {
    // prevent close on the main window
    if (process.env.NODE_ENV === 'production') {
      window.onbeforeunload = function(e) {
        if (!orbitStore.isTorn) {
          e.returnValue = false
        }
      }
    }
  }, [])

  React.useEffect(() => {
    return App.onMessage(App.messages.TOGGLE_SETTINGS, () => {
      AppActions.setOrbitDocked(true)
      paneManagerStore.setActivePaneByType('settings')
    })
  }, [])

  return (
    <OrbitToolBarProvider>
      <MergeContext Context={StoreContext} value={{ searchStore, orbitStore, headerStore }}>
        <MainShortcutHandler>
          <Theme name={theme}>
            <AppWrapper className={`theme-${theme} app-parent-bounds`}>
              <OrbitHeaderContainer className="draggable" onMouseUp={headerStore.handleMouseUp}>
                <OrbitHeader />
                <OrbitNav />
              </OrbitHeaderContainer>
              <InnerChrome torn={orbitStore.isTorn}>
                <OrbitControls />
                <Row flex={1}>
                  <OrbitSidebar />
                  <OrbitContent />
                </Row>
              </InnerChrome>
            </AppWrapper>
          </Theme>
        </MainShortcutHandler>
      </MergeContext>
    </OrbitToolBarProvider>
  )
})

const OrbitHeaderContainer = gloss(View, {
  position: 'relative',
  zIndex: 400,
}).theme((_, theme) => ({
  // borderBottom: [1, theme.borderColor],
  background: theme.headerBackground || theme.background.alpha(0.65),
}))

const defaultPanes = [
  { id: 'app-sources', name: 'Sources', type: 'sources', isHidden: true, keyable: true },
  { id: 'app-spaces', name: 'Spaces', type: 'spaces', isHidden: true, keyable: true },
  { id: 'app-settings', name: 'Settings', type: 'settings', isHidden: true, keyable: true },
  { id: 'app-apps', name: 'Apps', type: 'apps' },
  { id: 'app-createApp', name: 'Add app', type: 'createApp' },
  { id: 'app-onboard', name: 'Onboard', type: 'onboard' },
]

function useOnce(fn: Function, reset = []) {
  return React.useCallback(once(fn as any), reset)
}

const OrbitPageProvideStores = observer(function OrbitPageProvideStores(props: any) {
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const spaceStore = useStore(SpaceStore)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const orbitWindowStore = useStore(OrbitWindowStore, { queryStore })
  const activeApps = useActiveAppsSorted()
  const newAppStore = useStore(NewAppStore)

  const panes = [
    // these go first so they can stay stable when switching spaces
    // where the index would go crazy and change
    // TODO would be better if paneManager use ID now instead of index, i think
    ...defaultPanes,
    ...activeApps.map(app => ({
      ...app,
      id: `${app.id}`,
      keyable: true,
    })),
  ]

  const paneManagerStore = useStore(PaneManagerStore, {
    defaultIndex: orbitWindowStore.activePaneIndex,
    onPaneChange(index) {
      orbitWindowStore.activePaneIndex = index
    },
    panes,
  })

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
  }

  return (
    <MergeContext Context={StoreContext} value={stores}>
      {props.children}
    </MergeContext>
  )
})

const InnerChrome = gloss<{ torn?: boolean } & ViewProps>(View, {
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1,
}).theme(({ torn }) => ({
  boxShadow: [torn ? null : [0, 0, 80, [0, 0, 0, 0.05]]],
}))
