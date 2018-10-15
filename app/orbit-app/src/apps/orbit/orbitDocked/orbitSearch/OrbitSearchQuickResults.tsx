import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SearchStore } from '../SearchStore'
import { SelectionStore } from '../SelectionStore'
import { SelectableCarousel } from '../../../../components/SelectableCarousel'
import { Banner } from '../../../../views/Banner'
import { View } from '@mcro/ui'

type Props = {
  searchStore?: SearchStore
  selectionStore: SelectionStore
}

const cardProps = {
  pane: 'docked-search',
  subPane: 'search',
  titleProps: {
    ellipse: true,
  },
  hide: {
    icon: true,
  },
  inGrid: true,
}

const decorate = compose(
  view.attach('searchStore', 'selectionStore'),
  view,
)
export const OrbitSearchQuickResults = decorate(({ searchStore }: Props) => {
  const { isActive, activeQuery } = searchStore
  const { results, query } = searchStore.quickSearchState
  if (!results.length) {
    if (!!query && searchStore.hasSearchResults) {
      return <Banner>Drop result here to pin</Banner>
    } else {
      return null
    }
  }
  return (
    <View opacity={isActive && activeQuery === query ? 1 : 0.5}>
      <SelectableCarousel
        offset={0}
        cardHeight={58}
        cardWidth={180}
        cardSpace={4}
        cardProps={cardProps}
        items={results}
        horizontalPadding={6}
      />
      <div style={{ height: 6 }} />
    </View>
  )
})
