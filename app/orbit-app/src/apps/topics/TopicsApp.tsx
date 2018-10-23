import * as React from 'react'
import { view } from '@mcro/black'
import { App } from '@mcro/stores'
import { PaneManagerStore } from '../../pages/OrbitPage/PaneManagerStore'
import { SearchStore } from '../../pages/OrbitPage/orbitDocked/SearchStore'
import { SelectionStore } from '../../pages/OrbitPage/orbitDocked/SelectionStore'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { OrbitMasonry } from '../../views/OrbitMasonry'
import { SettingStore } from '../../stores/SettingStore'

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  selectionStore?: SelectionStore
  settingStore?: SettingStore
}

class TopicsStore {
  props: Props

  get results() {
    if (!this.props.settingStore.setting) {
      return []
    }
    return this.props.settingStore.setting.values.topTopics
  }
}

@view.attach('settingStore', 'paneManagerStore', 'searchStore', 'selectionStore')
@view.attach({
  store: TopicsStore,
})
@view
export class TopicsApp extends React.Component<Props & { store?: TopicsStore }> {
  render() {
    const { results } = this.props.store
    return (
      <ProvideHighlightsContextWithDefaults
        value={{ words: ['app'], maxChars: 500, maxSurroundChars: 80 }}
      >
        <OrbitMasonry
          items={results}
          offset={0}
          cardProps={{
            direct: true,
            query: App.state.query,
          }}
        />
      </ProvideHighlightsContextWithDefaults>
    )
  }
}
