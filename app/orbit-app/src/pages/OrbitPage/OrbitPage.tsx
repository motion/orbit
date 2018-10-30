import * as React from 'react'
import { provide } from '@mcro/black'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { AppsStore } from '../../stores/AppsStore'
import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../../views'
import { HighlightsPage } from '../HighlightsPage/HighlightsPage'
import { QueryStore } from '../../stores/QueryStore'
import { SelectionStore } from '../../stores/SelectionStore'
import { OrbitDocked } from './orbitDocked/OrbitDocked'
import { SettingStore } from '../../stores/SettingStore'
import { PaneManagerStore } from './PaneManagerStore'
import { SearchStore } from '../../stores/SearchStore'
import { OrbitStore } from '../../stores/OrbitStore'

@provide({
  settingStore: SettingStore,
  appsStore: AppsStore,
  orbitWindowStore: OrbitWindowStore,
})
@provide({
  orbitStore: OrbitStore,
})
@provide({
  queryStore: QueryStore,
})
@provide({
  selectionStore: SelectionStore,
})
@provide({
  paneManagerStore: PaneManagerStore,
})
@provide({
  searchStore: SearchStore,
})
export class OrbitPage extends React.Component {
  render() {
    return (
      <MainShortcutHandler>
        <AppWrapper>
          <HighlightsPage />
          <OrbitDocked />
        </AppWrapper>
      </MainShortcutHandler>
    )
  }
}
