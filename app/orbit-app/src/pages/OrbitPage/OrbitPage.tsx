import * as React from 'react'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { AppWrapper } from '../../views'
import { HighlightsLayer } from './highlightsLayer/HighlightsLayer'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../stores/SelectionStore'
import { SettingStore } from '../../stores/SettingStore'
import { SpaceStore, AppPanes } from '../../stores/SpaceStore'
import { OrbitLayer } from './orbitLayer/OrbitLayer'
import { Theme } from '@mcro/ui'
import { App } from '@mcro/stores'
import { useStore } from '@mcro/use-store'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { StoreContext } from '@mcro/black'

export function OrbitPage() {
  const theme = App.state.darkTheme ? 'clearDark' : 'clearLight'
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const orbitWindowStore = useStore(OrbitWindowStore)
  const spaceStore = useStore(SpaceStore)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const selectionStore = useStore(SelectionStore, { queryStore })
  const paneManagerStore = useStore(PaneManagerStore, {
    selectionStore,
    panes: [...AppPanes.map(p => p.id), 'settings'],
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
      <Theme name={theme}>
        <AppWrapper>
          <HighlightsLayer />
          <OrbitLayer />
        </AppWrapper>
      </Theme>
    </StoreContext.Provider>
  )
}
