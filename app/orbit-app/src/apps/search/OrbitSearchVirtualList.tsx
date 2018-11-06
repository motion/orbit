import * as React from 'react'
import { SearchStore } from './SearchStore'
import { view, attach } from '@mcro/black'
import { OrbitListItem } from '../../views/OrbitListItem'
import { handleClickLocation } from '../../helpers/handleClickLocation'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { renderHighlightedText } from '../../views/SortableList/renderHighlightedText'
import { AppStore } from '../AppStore'
import { SortableList } from '../../views/SortableList/SortableList'
import { ListItemProps } from '../../views/SortableList/SortableListItem'

type Props = {
  searchStore: SearchStore
  appStore?: AppStore
}

const spaceBetween = <div style={{ flex: 1 }} />

class ListItem extends React.PureComponent<ListItemProps> {
  render() {
    const { model, realIndex, query, ignoreSelection } = this.props
    return (
      <OrbitListItem
        pane="docked-search"
        subPane="search"
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
      />
    )
  }
}

@attach('appStore')
@view
export class OrbitSearchVirtualList extends React.Component<Props> {
  get items() {
    return this.props.searchStore.searchState.results || []
  }

  isRowLoaded = find => {
    return find.index < this.props.searchStore.searchState.results.length
  }

  render() {
    const { searchStore } = this.props
    log(`render OrbitSearchVirtualList (${this.items.length})`)
    return (
      <ProvideHighlightsContextWithDefaults
        value={{
          words: searchStore.searchState.query.split(' '),
          maxChars: 500,
          maxSurroundChars: 80,
        }}
      >
        <SortableList items={this.props.searchStore.searchState.results} ItemView={ListItem} />
      </ProvideHighlightsContextWithDefaults>
    )
  }
}
