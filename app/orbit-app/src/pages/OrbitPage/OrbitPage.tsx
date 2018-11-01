import * as React from 'react'
import { provide } from '@mcro/black'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { AppWrapper } from '../../views'
import { HighlightsLayer } from './highlightsLayer/HighlightsLayer'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../stores/SelectionStore'
import { SettingStore } from '../../stores/SettingStore'
import { OrbitStore } from '../../stores/OrbitStore'
import { OrbitLayer } from './orbitLayer/OrbitLayer'
import { MenuLayer } from './menuLayer/MenuLayer';

@provide({
  settingStore: SettingStore,
  sourcesStore: SourcesStore,
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
export class OrbitPage extends React.Component {
  render() {
    return (
      <AppWrapper>
        <HighlightsLayer />
        <MenuLayer />
        <OrbitLayer />
      </AppWrapper>
    )
  }
}
