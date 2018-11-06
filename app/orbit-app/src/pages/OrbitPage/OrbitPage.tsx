import * as React from 'react'
import { provide, view } from '@mcro/black'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { AppWrapper } from '../../views'
import { HighlightsLayer } from './highlightsLayer/HighlightsLayer'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../stores/SelectionStore'
import { SettingStore } from '../../stores/SettingStore'
import { OrbitStore } from '../../stores/OrbitStore'
import { OrbitLayer } from './orbitLayer/OrbitLayer'
import { Theme } from '@mcro/ui'
import { App } from '@mcro/stores'

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
@view
export class OrbitPage extends React.Component {
  render() {
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
