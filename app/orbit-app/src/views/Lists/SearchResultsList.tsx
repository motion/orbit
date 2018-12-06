import * as React from 'react'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { VirtualList, GetItemProps, VirtualListProps } from '../../views/VirtualList/VirtualList'
import { GroupedSearchItem } from '../../views/ListItems/GroupedSearchItem'
import { ListItemProps } from '../../views/VirtualList/VirtualListItem'
import { ListItemBit } from '../../views/ListItems/ListItemBit'
import { SearchResult } from '@mcro/models'
import { StoreContext } from '@mcro/black'

type SearchResultsListProps = Partial<VirtualListProps> & {
  query: string
  results: SearchResult[]
  offsetY?: number
}

export const SearchResultsList = ({ results, offsetY = 0, ...props }: SearchResultsListProps) => {
  const { searchStore, appStore } = React.useContext(StoreContext)

  const isRowLoaded = find => {
    return find.index < results.length
  }

  const getItemProps: GetItemProps = index => {
    const model = results[index]
    if (index === 0 || model.group !== results[index - 1].group) {
      let separator: string
      if (model.group === 'last-day' || !model.group) {
        separator = 'Last Day'
      } else if (model.group === 'last-week') {
        separator = 'Last Week'
      } else if (model.group === 'last-month') {
        separator = 'Last Month'
      } else {
        separator = 'All Period'
      }
      return { separator }
    }
    return {}
  }

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
        items={searchStore.resultsForVirtualList}
        rowCount={searchStore.remoteRowCount}
        loadMoreRows={searchStore.loadMore}
        isRowLoaded={isRowLoaded}
        getItemProps={getItemProps}
        {...props}
      />
    </ProvideHighlightsContextWithDefaults>
  )
}

class SearchResultListItem extends React.PureComponent<ListItemProps> {
  render() {
    const { model, realIndex, query, ...props } = this.props
    if (model.target === 'search-group') {
      const item = model as any
      return <GroupedSearchItem item={item} index={realIndex} query={query} {...props} />
    }
    return <ListItemBit {...this.props} />
  }
}
