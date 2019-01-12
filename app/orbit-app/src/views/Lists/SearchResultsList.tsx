import * as React from 'react'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { VirtualList, VirtualListProps, GetItemProps } from '../../views/VirtualList/VirtualList'
import { PersonBit, Bit } from '@mcro/models'
import { SearchResultListItem } from '../ListItems/SearchResultListItem'
import { HandleSelection } from '../ListItems/OrbitItemProps'
import { normalizeItem } from '../../helpers/normalizeItem'
import { useStoresSafe } from '../../hooks/useStoresSafe'

export type SearchableItem = (Bit | PersonBit)[]

type SearchResultsListProps = VirtualListProps & {
  onSelect: HandleSelection
  onOpen: HandleSelection
  query: string
  offsetY?: number
}

const getItemAppConfig = (items: any[]): GetItemProps => (index: number) => {
  // normalize bits if handed in directly
  const item = items[index]
  const target = item.target
  switch (target) {
    case 'person-bit':
    case 'bit':
      return {
        ...normalizeItem(item),
        group: item.group,
      }
  }
  return null
}

export const SearchResultsList = ({
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
          getItemProps={getItemAppConfig(items)}
          ItemView={SearchResultListItem}
          maxHeight={appStore.maxHeight - offsetY}
          isRowLoaded={isRowLoaded}
          itemProps={{
            ...itemProps,
            onSelect,
            onOpen,
          }}
          {...props}
        />
      </ProvideHighlightsContextWithDefaults>
    ),
    [itemsKey],
  )

  return list
}
