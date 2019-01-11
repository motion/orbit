import * as React from 'react'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { VirtualList, VirtualListProps } from '../../views/VirtualList/VirtualList'
import { PersonBit, Bit } from '@mcro/models'
import { StoreContext } from '@mcro/black'
import { SearchResultListItem } from '../ListItems/SearchResultListItem'
import { HandleSelection } from '../ListItems/OrbitItemProps'
import { normalizeItem } from '../../helpers/normalizeItem'

export type SearchableItem = (Bit | PersonBit)[]

type SearchResultsListProps = VirtualListProps & {
  onSelect: HandleSelection
  onOpen: HandleSelection
  query: string
  offsetY?: number
}

const getItemAppConfig = items => index => {
  // normalize bits if handed in directly
  return items[index].target === 'bit' ? normalizeItem(items[index]) : null
}

export const SearchResultsList = ({
  items,
  offsetY = 0,
  itemProps,
  onSelect,
  onOpen,
  ...props
}: SearchResultsListProps) => {
  const { appStore } = React.useContext(StoreContext)
  const isRowLoaded = React.useCallback(find => find.index < items.length, [
    items.map(x => x.id).join(' '),
  ])

  return (
    <ProvideHighlightsContextWithDefaults
      value={{
        words: props.query.split(' '),
        maxChars: 500,
        maxSurroundChars: 80,
      }}
    >
      <VirtualList
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
  )
}
