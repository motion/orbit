import { gloss, View } from '@mcro/gloss'
import { App } from '@mcro/stores'
import { Theme } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { OrbitToolBarProvider } from '../../components/OrbitToolbar'
import MainShortcutHandler from '../../components/shortcutHandlers/MainShortcutHandler'
import { StoreContext } from '../../contexts'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { useUserSpaceConfig } from '../../hooks/useUserSpaceConfig'
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
import OrbitNav from './OrbitNav'
import OrbitPageContent from './OrbitPageContent'
import { OrbitStore } from './OrbitStore'

export default function OrbitPage() {
  return (
    <OrbitPageProvideStores>
      <OrbitPageInner />
    </OrbitPageProvideStores>
  )
}

const OrbitPageInner = observer(function OrbitPageInner() {
  const searchStore = useStore(SearchStore)
  const orbitStore = useStore(OrbitStore)
  const headerStore = useStore(HeaderStore)
  const theme = App.state.darkTheme ? 'dark' : 'light'

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
                <OrbitPageContent />
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

function OrbitPageProvideStores(props: { children: any }) {
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const spaceStore = useStore(SpaceStore)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const orbitWindowStore = useStore(OrbitWindowStore, { queryStore })
  const activeApps = useActiveAppsSorted()
  const newAppStore = useStore(NewAppStore)
  const [spaceConfig, updateSpaceConfig] = useUserSpaceConfig()
  const paneManagerStore = useStore(PaneManagerStore, {
    defaultIndex: spaceConfig.activePaneIndex || 0,
    onPaneChange(index) {
      // reset name on pane change...
      newAppStore.reset()
      if (index !== spaceConfig.activePaneIndex) {
        updateSpaceConfig({
          activePaneIndex: index,
        })
      }
    },
    panes: [
      ...activeApps.map(app => ({
        ...app,
        id: `${app.id}`,
        keyable: true,
      })),
      ...[
        { id: 'app-settings', name: 'Settings', type: 'settings' },
        { id: 'app-apps', name: 'Apps', type: 'apps' },
        { id: 'app-sources', name: 'Sources', type: 'sources' },
        { id: 'app-apps-new', name: 'New...', type: 'apps' },
        { id: 'app-onboard', name: 'Onboard', type: 'onboard' },
      ],
    ],
  })

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
}

const InnerChrome = gloss<{ torn?: boolean }>({
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1,
}).theme(({ torn }) => ({
  boxShadow: [torn ? null : [0, 0, 80, [40, 40, 40, 0.28]]],
}))
