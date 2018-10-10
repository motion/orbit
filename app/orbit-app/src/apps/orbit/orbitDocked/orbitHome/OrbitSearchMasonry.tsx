import * as React from 'react'
import { view } from '@mcro/black'
import { SearchStore } from '../SearchStore'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore } from '../SelectionStore'
import { ProvideHighlightsContextWithDefaults } from '../../../../helpers/contexts/HighlightsContext'
import { OrbitMasonry } from '../../../../views/OrbitMasonry'

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  selectionStore?: SelectionStore
}

@view.attach('paneManagerStore', 'searchStore', 'selectionStore')
@view
export class OrbitSearchMasonry extends React.Component<Props> {
  render() {
    const { searchStore } = this.props
    const { results, query } = searchStore.searchState
    if (!results || !results.length) {
      return null
    }
    const quickResultsLen = searchStore.quickSearchState.results.length
    return (
      <ProvideHighlightsContextWithDefaults
        value={{ words: query.split(' '), maxChars: 500, maxSurroundChars: 80 }}
      >
        <OrbitMasonry
          items={results}
          offset={quickResultsLen}
          cardProps={{
            query,
            searchStore,
          }}
        />
      </ProvideHighlightsContextWithDefaults>
    )
  }
}
