import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SearchStore } from '../../../../stores/SearchStore'
import { AppStore } from '../../../../stores/AppStore'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore } from '../../../../stores/SelectionStore'
import { Carousel } from '../../../../components/Carousel'

const height = 100

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
  style: {
    width: 240,
    height: height - 20, // 20 == shadow space
    marginRight: 10,
  },
  cardProps: {
    inGrid: true,
    flex: 1,
    hide: {
      icon: true,
    },
  },
}

export const OrbitSearchQuickResults = decorate(
  ({ searchStore, selectionStore }: Props) => {
    const { results } = searchStore.quickSearchState
    if (!results.length) {
      return null
    }
    return (
      <Carousel
        scrollTo={selectionStore.nextIndex}
        cardProps={cardProps}
        items={results}
        horizontalPadding={14}
      />
    )
  },
)
