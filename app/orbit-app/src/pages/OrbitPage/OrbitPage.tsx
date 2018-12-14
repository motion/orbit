import * as React from 'react'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { AppWrapper } from '../../views'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
// import { SelectionStore } from '../../stores/SelectionStore'
import { SettingStore } from '../../stores/SettingStore'
import { SpaceStore, AppPanes } from '../../stores/SpaceStore'
import { Theme } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { StoreContext, view } from '@mcro/black'
import { AppActions } from '../../actions/AppActions'
import { OrbitOnboard } from './OrbitOnboard'
import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { OrbitHeader } from './OrbitHeader'
import { App } from '@mcro/stores'
import { OrbitNav } from './OrbitNav'
import { OrbitPageContent } from './OrbitPageContent'
import { observer } from 'mobx-react-lite'

export const OrbitPage = observer(() => {
  const theme = App.state.darkTheme ? 'dark' : 'light'
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const spaceStore = useStore(SpaceStore)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const orbitWindowStore = useStore(OrbitWindowStore, { queryStore })
  const paneManagerStore = useStore(PaneManagerStore, {
    panes: [...AppPanes.map(p => p.id), 'settings', 'sources', 'onboard'],
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
    paneManagerStore,
  }

  return (
    <StoreContext.Provider value={stores}>
      <MainShortcutHandler queryStore={queryStore}>
        <Theme name={theme}>
          <AppWrapper className={`theme-${theme} app-parent-bounds`}>
            <Chrome>
              <OrbitHeader />
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
