import { gloss } from '@mcro/gloss'
import { App } from '@mcro/stores'
import { Theme } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { OrbitToolBarRender } from '../../components/OrbitToolbar'
import MainShortcutHandler from '../../components/shortcutHandlers/MainShortcutHandler'
import { StoreContext } from '../../contexts'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { useUserSpaceConfig } from '../../hooks/useUserSpaceConfig'
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
import OrbitHeader from './OrbitHeader'
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
    <MergeContext Context={StoreContext} value={{ searchStore, orbitStore }}>
      <MainShortcutHandler>
        <Theme name={theme}>
          <AppWrapper className={`theme-${theme} app-parent-bounds`}>
            <OrbitHeader />
            <InnerChrome torn={orbitStore.isTorn}>
              <OrbitToolBarRender />
              <OrbitPageContent />
            </InnerChrome>
          </AppWrapper>
        </Theme>
      </MainShortcutHandler>
    </MergeContext>
  )
})

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
        keyable: true,
      })),
      ...[
        { name: 'Settings', type: 'settings' },
        { name: 'Apps', type: 'apps' },
        { name: 'Sources', type: 'sources' },
        { name: 'Add app', type: 'createApp' },
        { name: 'Onboard', type: 'onboard' },
      ].map((pane, id) => ({ ...pane, id: `app-${id}` })),
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
}).theme(({ torn }) => ({
  boxShadow: [torn ? null : [0, 0, 80, [40, 40, 40, 0.28]]],
}))
