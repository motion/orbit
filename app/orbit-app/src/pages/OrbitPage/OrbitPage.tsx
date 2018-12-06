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
import { OrbitNav } from './OrbitNav'
import { OrbitPageContent } from './OrbitPageContent'

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
      if (App.peekState.target) {
        AppActions.clearPeek()
      }
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
    <StoreContext.Provider value={stores}>
      <MainShortcutHandler queryStore={queryStore}>
        <Theme name={theme}>
          <AppWrapper className={`theme-${theme} app-parent-bounds`}>
            <Chrome>
              <OrbitHeader queryStore={queryStore} />
              <OrbitNav />

              <InnerChrome>
                <OrbitPageContent />
              </InnerChrome>

              <OrbitOnboard />
            </Chrome>
          </AppWrapper>
        </Theme>
      </MainShortcutHandler>
    </StoreContext.Provider>
  )
})

const Chrome = view({
  flex: 1,
}).theme(props => ({
  background: props.theme.background.alpha(0.25),
}))

const InnerChrome = view({
  flexFlow: 'row',
  flex: 1,
  overflow: 'hidden',
}).theme(({ theme }) => ({
  background: theme.background,
}))
