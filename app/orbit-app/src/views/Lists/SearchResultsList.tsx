import * as React from 'react'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { VirtualList, VirtualListProps } from '../../views/VirtualList/VirtualList'
import { PersonBit, Bit } from '@mcro/models'
import { StoreContext } from '@mcro/black'
import { SearchResultListItem } from '../ListItems/SearchResultListItem'
import { ResolvableModel } from '../../sources/types'

export type SearchableItem = (Bit | PersonBit)[]

type SearchResultsListProps = Partial<VirtualListProps> & {
  query: string
  results: ResolvableModel[]
  offsetY?: number
}

export const SearchResultsList = ({ results, offsetY = 0, ...props }: SearchResultsListProps) => {
  const { appStore } = React.useContext(StoreContext)

  return (
    <ProvideHighlightsContextWithDefaults
      value={{
        words: props.query.split(' '),
        maxChars: 500,
        maxSurroundChars: 80,
      }}
    >
      <VirtualList
        ItemView={SearchResultListItem}
        maxHeight={appStore.maxHeight - offsetY}
        items={results}
        isRowLoaded={find => find.index < results.length}
        {...props}
      />
    </ProvideHighlightsContextWithDefaults>
  )
}
