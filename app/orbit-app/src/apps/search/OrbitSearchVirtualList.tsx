import * as React from 'react'
import {
  WindowScroller,
  List,
  CellMeasurerCache,
  CellMeasurer,
  InfiniteLoader,
} from 'react-virtualized'
import { SearchStore } from '../../stores/SearchStore'
import { view, ensure, attach } from '@mcro/black'
import { View } from '@mcro/ui'
import { HighlightText } from '../../views/HighlightText'
import { OrbitListItem } from '../../views/OrbitListItem'
import { handleClickLocation } from '../../helpers/handleClickLocation'
import { Bit } from '@mcro/models'
import { reaction, trace } from 'mobx'
import { debounce } from 'lodash'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { SelectionStore } from '../../stores/SelectionStore'
import { OrbitItemSingleton } from '../../views/OrbitItemStore'
import { Banner } from '../../views/Banner'
import { SubPaneStore } from '../../components/SubPaneStore'

type Props = {
  searchStore?: SearchStore
  selectionStore?: SelectionStore
  subPaneStore?: SubPaneStore
}

const renderListItemChildren = ({ content = null }) => {
  return (
    <OrbitCardContent>
      <HighlightText whiteSpace="normal" alpha={0.65} options={{ maxSurroundChars: 100 }}>
        {collapseWhitespace(content)}
      </HighlightText>
    </OrbitCardContent>
  )
}

const OrbitCardContent = view({
  padding: [6, 0],
  flex: 1,
  overflow: 'hidden',
  whiteSpace: 'pre',
})

const collapseWhitespace = str => (typeof str === 'string' ? str.replace(/\n[\s]*/g, ' ') : str)

type ListItemProps = {
  model: Bit
  query?: string
  style?: Object
  cache?: any
  parent?: any
  width?: number
  index: number
  ignoreSelection?: boolean
}

const spaceBetween = <div style={{ flex: 1 }} />

class ListItem extends React.PureComponent<ListItemProps> {
  render() {
    const { model, index, query, ignoreSelection } = this.props
    return (
      <OrbitListItem
        pane="docked-search"
        subPane="search"
        index={index}
        model={model}
        subtitleSpaceBetween={spaceBetween}
        isExpanded
        searchTerm={query}
        onClickLocation={handleClickLocation}
        maxHeight={200}
        overflow="hidden"
        extraProps={{
          minimal: true,
          preventSelect: true,
        }}
        ignoreSelection={ignoreSelection}
      >
        {renderListItemChildren}
      </OrbitListItem>
    )
  }
}

const FirstItems = view(({ items, searchStore }) => {
  return (
    <div
      style={{
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          model={item}
          index={index + searchStore.quickSearchState.results.length}
          ignoreSelection
        />
      ))}
    </div>
  )
})

@attach('searchStore', 'selectionStore', 'subPaneStore')
@view
export class OrbitSearchVirtualList extends React.Component<Props> {
  windowScrollerRef = React.createRef<WindowScroller>()
  listRef: List

  state = {
    height: 0,
    isSorting: false,
  }

  private shouldResizeAll = false
  private cache = new CellMeasurerCache({
    defaultHeight: 60,
    fixedWidth: true,
  })

  private resizeOnChange = reaction(
    () => this.items && Math.random(),
    () => {
      if (this.listRef) {
        this.resizeAll()
      }
    },
  )

  private scrollToRow = reaction(
    () => this.props.selectionStore.activeIndex - this.offset,
    index => {
      try {
        ensure('not clicked', Date.now() - OrbitItemSingleton.lastClick > 50)
        ensure('valid index', index > -1)
        ensure('has list', !!this.listRef)
      } catch {
        return
      }
      this.listRef.scrollToRow(index)
    },
  )

  get paneNode() {
    return this.props.subPaneStore.paneNode
  }

  observing = false

  componentDidUpdate() {
    this.observePaneSize()
    if (this.shouldResizeAll) {
      this.resizeAll()
    }
  }

  componentDidMount() {
    this.observePaneSize()
  }

  observePaneSize() {
    if (!this.observing && this.paneNode) {
      this.observing = true
      this.resizeObserver.observe(this.paneNode)
      this.measure()
    }
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect()
    this.resizeOnChange()
    this.scrollToRow()
  }

  private get offset() {
    return this.props.searchStore.quickSearchState.results.length
  }

  private measure = debounce(() => {
    if (this.paneNode.clientHeight !== this.state.height) {
      const height = this.paneNode.clientHeight
      if (height !== this.state.height) {
        console.log('measure complete, old height', this.state.height, 'new height', height)
        this.setState({ height })
      }
    }
  }, 16)

  // @ts-ignore
  resizeObserver = new ResizeObserver(this.measure)

  private rowRenderer = ({ index, parent, style }) => {
    const { searchStore } = this.props
    const model = this.items[index]
    return (
      <CellMeasurer
        key={`${model.id}${index}`}
        cache={this.cache}
        columnIndex={0}
        parent={parent}
        rowIndex={index}
        width={this.cache}
      >
        <div style={style}>
          <ListItem
            model={model}
            index={index + this.offset}
            query={searchStore.searchState.query}
          />
        </div>
      </CellMeasurer>
    )
  }

  get items() {
    return this.props.searchStore.searchState.results || []
  }

  private resizeAll = debounce(() => {
    this.shouldResizeAll = false
    this.cache.clearAll()
    if (this.listRef) {
      this.listRef.recomputeRowHeights()
    }
  })

  isRowLoaded = find => {
    return find.index < this.props.searchStore.searchState.results.length
  }

  render() {
    const { searchStore } = this.props
    log(
      `render OrbitSearchVirtualList (${this.items.length}) ${this.state.height}`,
      searchStore.searchState.query,
    )
    trace()
    if (!this.items.length) {
      return (
        <View margin={[10, 0]}>
          <Banner>No results</Banner>
        </View>
      )
    }
    return (
      <ProvideHighlightsContextWithDefaults
        value={{
          words: searchStore.searchState.query.split(' '),
          maxChars: 500,
          maxSurroundChars: 80,
        }}
      >
        {/* double render the first few items so we can measure height, but hide them, if we have lots of results just show a large bar */}
        {this.items.length < 20 ? (
          <FirstItems items={this.items.slice(0, 20)} searchStore={searchStore} />
        ) : (
          <div style={{ height: 2000 }} />
        )}
        {!!this.state.height && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 1,
            }}
          >
            <InfiniteLoader
              isRowLoaded={this.isRowLoaded}
              loadMoreRows={searchStore.loadMore}
              rowCount={searchStore.remoteRowCount}
            >
              {({ onRowsRendered, registerChild }) => (
                <List
                  ref={ref => {
                    if (ref) {
                      registerChild(ref)
                      this.listRef = ref
                    }
                  }}
                  items={this.items}
                  deferredMeasurementCache={this.cache}
                  height={this.state.height}
                  width={this.paneNode.clientWidth}
                  rowHeight={this.cache.rowHeight}
                  overscanRowCount={20}
                  rowCount={this.items.length}
                  estimatedRowSize={100}
                  rowRenderer={this.rowRenderer}
                  pressDelay={120}
                  pressThreshold={17}
                  onRowsRendered={onRowsRendered}
                  lockAxis="y"
                />
              )}
            </InfiniteLoader>
          </div>
        )}
      </ProvideHighlightsContextWithDefaults>
    )
  }
}
