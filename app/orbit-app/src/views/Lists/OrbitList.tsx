import * as React from 'react'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { default as VirtualList, VirtualListProps } from '../VirtualList/VirtualList'
import { PersonBit, Bit } from '@mcro/models'
import { OrbitListItem } from '../ListItems/OrbitListItem'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { HandleSelection } from '../ListItems/ListItem'

export type SearchableItem = (Bit | PersonBit)[]

type SearchResultsListProps = VirtualListProps & {
  onSelect: HandleSelection
  onOpen: HandleSelection
  query: string
  offsetY?: number
}

export const OrbitList = ({
  items,
  offsetY = 0,
  itemProps,
  onSelect,
  onOpen,
  ...props
}: SearchResultsListProps) => {
  const { appStore } = useStoresSafe()
  const itemsKey = items.map(x => `${x.id || x.email || x.key}`).join(' ')
  const isRowLoaded = React.useCallback(find => find.index < items.length, [itemsKey])

  const list = React.useMemo(
    () => (
      <ProvideHighlightsContextWithDefaults
        value={{
          words: props.query.split(' '),
          maxChars: 500,
          maxSurroundChars: 80,
        }}
      >
        <VirtualList
          key={itemsKey}
          items={items}
          ItemView={OrbitListItem}
          maxHeight={appStore.maxHeight - offsetY}
          isRowLoaded={isRowLoaded}
          itemProps={{
            onSelect,
            onOpen,
            ...itemProps,
          }}
          {...props}
        />
      </ProvideHighlightsContextWithDefaults>
    ),
    [itemsKey],
  )

  return list
}
