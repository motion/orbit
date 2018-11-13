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
import { StaticContainer } from '../../views/StaticContainer'

export const OrbitPage = React.memo(() => {
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const spaceStore = useStore(SpaceStore)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const orbitWindowStore = useStore(OrbitWindowStore, { queryStore })
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
    <StaticContainer>
      <StoreContext.Provider value={stores}>
        <OrbitPageInner />
      </StoreContext.Provider>
    </StaticContainer>
  )
})

class OrbitPageInner extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    log('RENDER ORBIT PAGE INNER')
    const theme = App.state.darkTheme ? 'clearDark' : 'clearLight'
    return (
      <Theme name={theme}>
        <AppWrapper>
          <HighlightsLayer />
          <OrbitLayer />
        </AppWrapper>
      </Theme>
    )
  }
}
