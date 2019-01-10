import * as React from 'react'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { VirtualList, VirtualListProps } from '../../views/VirtualList/VirtualList'
import { PersonBit, Bit } from '@mcro/models'
import { StoreContext } from '@mcro/black'
import { SearchResultListItem } from '../ListItems/SearchResultListItem'

export type SearchableItem = (Bit | PersonBit)[]

type SearchResultsListProps = VirtualListProps & {
  query: string
  offsetY?: number
}

export const SearchResultsList = ({ items, offsetY = 0, ...props }: SearchResultsListProps) => {
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
        ItemView={SearchResultListItem}
        maxHeight={appStore.maxHeight - offsetY}
        isRowLoaded={isRowLoaded}
        {...props}
      />
    </ProvideHighlightsContextWithDefaults>
  )
}
