import * as React from 'react'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { AppWrapper } from '../../views'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../stores/SelectionStore'
import { SettingStore } from '../../stores/SettingStore'
import { SpaceStore, AppPanes } from '../../stores/SpaceStore'
import { Theme } from '@mcro/ui'
import { useStore, useInstantiatedStore } from '@mcro/use-store'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { StoreContext, view } from '@mcro/black'
import { AppActions } from '../../actions/AppActions'
import { OrbitOnboard } from './OrbitOnboard'
import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { OrbitHeader } from './OrbitHeader'
import { App } from '@mcro/stores'
import { BORDER_RADIUS } from '../../constants'
import { OrbitNav } from './OrbitNav'
import { OrbitMainContent } from './OrbitMainContent'

export const OrbitPage = React.memo(() => {
  const { darkTheme } = useInstantiatedStore(App).state
  const theme = darkTheme ? 'dark' : 'light'
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
      <StoreContext.Provider value={stores}>
        <Theme name={theme}>
          <AppWrapper className={`theme-${theme} app-parent-bounds`}>
            <OrbitHeader queryStore={queryStore} borderRadius={BORDER_RADIUS} />
            <OrbitNav />

            <OrbitPageChrome>
              <OrbitMainContent />
            </OrbitPageChrome>

            <OrbitOnboard />
          </AppWrapper>
        </Theme>
      </StoreContext.Provider>
    </MainShortcutHandler>
  )
})

const OrbitPageChrome = view({
  flexFlow: 'row',
  flex: 1,
  overflow: 'hidden',
}).theme(({ theme }) => ({
  background: theme.background,
}))
