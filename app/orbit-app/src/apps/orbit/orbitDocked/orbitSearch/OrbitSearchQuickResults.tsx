import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SearchStore } from '../SearchStore'
import { SelectionStore } from '../SelectionStore'
import { SelectableCarousel } from '../../../../components/SelectableCarousel'

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
  const { results } = searchStore.quickSearchState
  console.log('results', results)
  if (!results.length) {
    return null
  }
  return (
    <>
      <SelectableCarousel
        offset={0}
        cardHeight={56}
        cardWidth={200}
        cardSpace={10}
        cardProps={cardProps}
        items={results}
        horizontalPadding={10}
      />
      <div style={{ height: 12 }} />
    </>
  )
})
