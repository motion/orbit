import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SearchStore } from '../SearchStore'
import { SelectionStore } from '../SelectionStore'
import { SelectableCarousel } from '../../../../components/SelectableCarousel'
import { Text, Surface, Theme } from '@mcro/ui'

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
    return (
      <Theme name="clearDark">
        <Surface alignItems="center" justifyContent="center" padding={[6, 10]}>
          <Text size={0.95} alpha={0.9} fontWeight={400}>
            Drop result here to pin
          </Text>
        </Surface>
      </Theme>
    )
  }
  return (
    <>
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
    </>
  )
})
