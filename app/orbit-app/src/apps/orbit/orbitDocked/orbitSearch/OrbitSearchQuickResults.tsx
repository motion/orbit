import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SearchStore } from '../SearchStore'
import { AppStore } from '../../../AppStore'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore } from '../SelectionStore'
import { SelectableCarousel } from '../../../../components/SelectableCarousel'

const decorate = compose(
  view.attach('selectionStore'),
  view,
)

type Props = {
  appStore?: AppStore
  paneManagerStore?: PaneManagerStore
  searchStore: SearchStore
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

export const OrbitSearchQuickResults = decorate(({ searchStore }: Props) => {
  const { results } = searchStore.quickSearchState
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
        horizontalPadding={14}
      />
      <div style={{ height: 12 }} />
    </>
  )
})
