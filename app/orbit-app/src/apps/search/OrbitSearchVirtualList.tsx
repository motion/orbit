import * as React from 'react'
import { SearchStore } from './SearchStore'
import { view, attach } from '@mcro/black'
import { OrbitListItem } from '../../views/OrbitListItem'
import { handleClickLocation } from '../../helpers/handleClickLocation'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { AppStore } from '../AppStore'
import { ListItemProps } from '../../views/VirtualList/VirtualListItem'
import { renderHighlightedText } from '../../views/VirtualList/renderHighlightedText'
import { VirtualList } from '../../views/VirtualList/VirtualList'

type Props = {
  searchStore: SearchStore
  appStore?: AppStore
  offsetY?: number
}

const spaceBetween = <div style={{ flex: 1 }} />

class ListItem extends React.PureComponent<ListItemProps> {
  render() {
    const { model, realIndex, query, ignoreSelection, ...props } = this.props
    return (
      <OrbitListItem
        index={realIndex}
        model={model}
        subtitleSpaceBetween={spaceBetween}
        isExpanded
        searchTerm={query}
        onClickLocation={handleClickLocation}
        maxHeight={200}
        overflow="hidden"
        renderText={renderHighlightedText}
        extraProps={{
          oneLine: true,
          condensed: true,
          preventSelect: true,
        }}
        ignoreSelection={ignoreSelection}
        {...props}
      />
    )
  }
}

@attach('appStore')
@view
export class OrbitSearchVirtualList extends React.Component<Props> {
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
