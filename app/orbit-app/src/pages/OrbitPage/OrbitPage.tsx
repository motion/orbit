import * as React from 'react'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { AppWrapper } from '../../views'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../stores/SelectionStore'
import { SettingStore } from '../../stores/SettingStore'
import { SpaceStore, AppPanes } from '../../stores/SpaceStore'
import { Theme, Row } from '@mcro/ui'
import { useStore, useInstantiatedStore } from '@mcro/use-store'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { StoreContext, view } from '@mcro/black'
import { StaticContainer } from '../../views/StaticContainer'
import { AppActions } from '../../actions/AppActions'
import { memo } from '../../helpers/memo'
import { OrbitOnboard } from './OrbitOnboard'
import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { OrbitHeader } from './OrbitHeader'
import { App } from '@mcro/stores'
import { BORDER_RADIUS } from '../../constants'
import { OrbitSettings } from './OrbitSettings'
import { SpaceNav } from './SpaceNav'
import { OrbitPaneManager } from './OrbitPaneManager'
import { AppView } from '../../apps/AppView'

export const OrbitPage = memo(() => {
  const { darkTheme } = useInstantiatedStore(App).state
  const theme = darkTheme ? 'clearDark' : 'clearLight'
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const spaceStore = useStore(SpaceStore)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const orbitWindowStore = useStore(OrbitWindowStore, { queryStore })
  const selectionStore = useStore(SelectionStore, {
    queryStore,
    onClearSelection: () => {
      AppActions.clearPeek()
    },
  })
  const paneManagerStore = useStore(PaneManagerStore, {
    selectionStore,
    panes: [...AppPanes.map(p => p.id), 'settings', 'onboard'],
    onPaneChange: () => {
      AppActions.clearPeek()
    },
  })
  const stores = {
    settingStore,
    sourcesStore,
    orbitWindowStore,
    spaceStore,
    queryStore,
    selectionStore,
    paneManagerStore,
  }
  return (
    <MainShortcutHandler queryStore={queryStore}>
      <StaticContainer>
        <StoreContext.Provider value={stores}>
          <Theme name={theme}>
            <AppWrapper className={`theme-${theme} app-parent-bounds`}>
              <OrbitHeader queryStore={queryStore} borderRadius={BORDER_RADIUS} />
              <SpaceNav />

              <Row flex={1} overflow="hidden">
                <OrbitIndexView>
                  <OrbitPaneManager />
                </OrbitIndexView>
                <OrbitMainView>
                  <AppView type="bit" viewType="main" id="0" isActive title="ok" />
                </OrbitMainView>
              </Row>

              <OrbitOnboard />
              <OrbitSettings onChangeHeight={orbitWindowStore.setContentHeight} />
            </AppWrapper>
          </Theme>
        </StoreContext.Provider>
      </StaticContainer>
    </MainShortcutHandler>
  )
})

const OrbitIndexView = view({
  width: 300,
})

const OrbitMainView = view({
  flex: 1,
})
