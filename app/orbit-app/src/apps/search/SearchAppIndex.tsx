import * as React from 'react'
import { view } from '@mcro/black'
import { SearchStore } from './SearchStore'
import { ItemResolverDecorationContext } from '../../helpers/contexts/ItemResolverDecorationContext'
import { OrbitSearchNav } from './views/OrbitSearchNav'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'
import { StaticContainer } from '../../views/StaticContainer'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { VirtualList } from '../../views/VirtualList/VirtualList'
import { GroupedSearchItem } from './views/GroupedSearchItem'
import { OrbitListItem } from '../../views/OrbitListItem'
import { renderHighlightedText } from '../../views/VirtualList/renderHighlightedText'
import { ListItemProps } from '../../views/VirtualList/VirtualListItem'

const spaceBetween = <div style={{ flex: 1 }} />

export function SearchAppIndex(props: AppProps) {
  const searchStore = useStore(SearchStore, props)
  log(`SEARCH--------`)
  return (
    <>
      <OrbitSearchNav />
      <ItemResolverDecorationContext.Provider
        value={{
          item: null,
          text: {
            alpha: 0.6555,
          },
        }}
      >
        {/* <OrbitSearchQuickResults /> */}
        <OrbitSearchResultsFrame
          style={{
            opacity: searchStore.isChanging ? 0.7 : 1,
          }}
        >
          <StaticContainer>
            <SearchAppInner searchStore={searchStore} offsetY={60} {...props} />
          </StaticContainer>
        </OrbitSearchResultsFrame>
      </ItemResolverDecorationContext.Provider>
    </>
  )
}

const OrbitSearchResultsFrame = view({
  position: 'relative',
  transition: 'all ease 100ms',
  flex: 1,
})

@view
export class SearchAppInner extends React.PureComponent<
  AppProps & { searchStore: SearchStore; offsetY: number }
> {
  static defaultProps = {
    offsetY: 0,
  }

  get items() {
    return this.props.searchStore.searchState.results || []
  }

  isRowLoaded = find => {
    return find.index < this.props.searchStore.searchState.results.length
  }

  render() {
    const { searchStore, appStore, offsetY } = this.props
    log(`render OrbitSearchVirtualList (${this.items.length})`)
    return (
      <ProvideHighlightsContextWithDefaults
        value={{
          words: searchStore.searchState.query.split(' '),
          maxChars: 500,
          maxSurroundChars: 80,
        }}
      >
        <VirtualList
          infinite
          maxHeight={appStore.maxHeight - offsetY}
          items={searchStore.searchState.results}
          ItemView={ListItem}
          rowCount={searchStore.remoteRowCount}
          loadMoreRows={searchStore.loadMore}
          isRowLoaded={this.isRowLoaded}
          getItemProps={searchStore.getItemProps}
        />
      </ProvideHighlightsContextWithDefaults>
    )
  }
}

class ListItem extends React.PureComponent<ListItemProps> {
  render() {
    const { model, realIndex, query, ...props } = this.props
    if (model.group) {
      const item = model as any
      return <GroupedSearchItem item={item} index={realIndex} query={query} {...props} />
    }
    return (
      <OrbitListItem
        appType="search"
        index={realIndex}
        model={model}
        subtitleSpaceBetween={spaceBetween}
        searchTerm={query}
        maxHeight={200}
        overflow="hidden"
        renderText={renderHighlightedText}
        extraProps={{
          oneLine: true,
          condensed: true,
          preventSelect: true,
        }}
        {...props}
      />
    )
  }
}
