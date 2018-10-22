import * as React from 'react'
import { view } from '@mcro/black'
import { SearchStore } from '../SearchStore'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore } from '../SelectionStore'
import { ProvideHighlightsContextWithDefaults } from '../../../../helpers/contexts/HighlightsContext'
import { OrbitMasonry } from '../../../../views/OrbitMasonry'
import { loadMany } from '@mcro/model-bridge'
import { BitModel } from '@mcro/models'
import { App } from '@mcro/stores'

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  selectionStore?: SelectionStore
}

class TopicsStore {
  results = []

  async didMount() {
    this.results = await loadMany(BitModel, {
      args: {
        take: 20,
      },
    })
  }
}

@view.attach('paneManagerStore', 'searchStore', 'selectionStore')
@view.attach({
  store: TopicsStore,
})
@view
export class OrbitSearchMasonry extends React.Component<Props & { store?: TopicsStore }> {
  render() {
    const { results } = this.props.store
    return (
      <ProvideHighlightsContextWithDefaults
        value={{ words: App.state.query.split(' '), maxChars: 500, maxSurroundChars: 80 }}
      >
        <OrbitMasonry
          items={results}
          offset={0}
          cardProps={{
            query: App.state.query,
          }}
        />
      </ProvideHighlightsContextWithDefaults>
    )
  }
}
