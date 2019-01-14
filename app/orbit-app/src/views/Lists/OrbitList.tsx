import * as React from 'react'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { default as VirtualList, VirtualListProps, GetItemProps } from '../VirtualList/VirtualList'
import { PersonBit, Bit } from '@mcro/models'
import { OrbitListItem } from '../ListItems/OrbitListItem'
import { HandleSelection } from '../ListItems/ListItemProps'
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
          getItemProps={getItemAppConfig(items)}
          ItemView={OrbitListItem}
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
