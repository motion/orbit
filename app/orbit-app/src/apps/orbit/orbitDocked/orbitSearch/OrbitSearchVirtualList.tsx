import * as React from 'react'
import {
  WindowScroller,
  List,
  CellMeasurerCache,
  CellMeasurer,
  InfiniteLoader,
} from 'react-virtualized'
import { SearchStore } from '../SearchStore'
import { view, ensure } from '@mcro/black'
import { Text, View } from '@mcro/ui'
import { HighlightText } from '../../../../views/HighlightText'
import { OrbitListItem } from '../../../../views/OrbitListItem'
import { handleClickLocation } from '../../../../helpers/handleClickLocation'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { Bit } from '@mcro/models'
import { reaction, trace } from 'mobx'
import { debounce } from 'lodash'
import { ProvideHighlightsContextWithDefaults } from '../../../../helpers/contexts/HighlightsContext'
import { SelectionStore } from '../SelectionStore'
import { OrbitItemSingleton } from '../../../../views/OrbitItemStore'
import { SubPaneStore } from '../../SubPaneStore'
import { Banner } from '../../../../views/Banner'

type Props = {
  searchStore?: SearchStore
  selectionStore?: SelectionStore
  subPaneStore?: SubPaneStore
}

const hideSlack = {
  title: true,
  people: true,
}

const renderListItemChildren = ({ content }, bit) => {
  return bit.integration === 'slack' ? (
    <SearchResultText>{content}</SearchResultText>
  ) : (
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

const SearchResultText = props => <Text wordBreak="break-all" fontWeight={400} {...props} />
const collapseWhitespace = str => (typeof str === 'string' ? str.replace(/\n[\s]*/g, ' ') : str)

type ListItemProps = {
  model: Bit
  query?: string
  style?: Object
  cache?: any
  parent?: any
  width?: number
  realIndex: number
  ignoreSelection?: boolean
}

const spaceBetween = <div style={{ flex: 1 }} />

class ListItem extends React.PureComponent<ListItemProps> {
  render() {
    const { model, realIndex, query, ignoreSelection } = this.props
    const isConversation = model.integration === 'slack'
    if (!ignoreSelection) {
      console.log('i', realIndex)
    }
    return (
      <OrbitListItem
        pane="docked-search"
        subPane="search"
        index={realIndex}
        model={model}
        hide={isConversation ? hideSlack : null}
        subtitleSpaceBetween={spaceBetween}
        isExpanded
        searchTerm={query}
        onClickLocation={handleClickLocation}
        maxHeight={isConversation ? 380 : 200}
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

class VirtualList extends React.Component<any> {
  render() {
    return <List {...this.props} ref={this.props.forwardRef} />
  }
}

const SortableListItem = SortableElement(ListItem)
const SortableList = SortableContainer(VirtualList, { withRef: true })

const FirstItems = view(({ items, searchStore }) => {
  return (
    <div
      style={{
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {items.slice(0, 10).map((item, index) => (
        <ListItem
          key={item.id}
          model={item}
          realIndex={index + searchStore.quickSearchState.results.length}
          ignoreSelection
        />
      ))}
    </div>
  )
})

@view.attach('searchStore', 'selectionStore', 'subPaneStore')
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
        console.log('forceUpdateGrid')
        this.listRef.forceUpdateGrid()
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

  private measure = () => {
    if (this.paneNode.clientHeight !== this.state.height) {
      const height = this.paneNode.clientHeight
      if (height !== this.state.height) {
        console.log('setting height', height)
        this.setState({ height })
      }
    }
  }
  // @ts-ignore
  resizeObserver = new ResizeObserver(this.measure)

  private rowRenderer = ({ index, parent, style }) => {
    const { searchStore } = this.props
    const model = this.items[index]
    return (
      <CellMeasurer
        key={`${model.id}`}
        cache={this.cache}
        columnIndex={0}
        parent={parent}
        rowIndex={index}
        width={this.cache}
      >
        <div style={style}>
          <SortableListItem
            model={model}
            index={index}
            realIndex={index + this.offset}
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
    console.log('resizing all...')
    this.shouldResizeAll = false
    this.cache.clearAll()
    if (this.listRef) {
      this.listRef.recomputeRowHeights()
    }
  })

  handleSortEnd = () => {
    if (this.state.isSorting) {
      this.setState({ isSorting: false })
    }
  }

  handleSortStart = () => {
    if (!this.state.isSorting) {
      this.setState({ isSorting: true })
    }
  }

  render() {
    const { searchStore } = this.props
    log(
      `render OrbitSearchVirtualList (${this.items.length}) ${this.state.height} ${
        searchStore.searchState.query
      }`,
    )
    window.x = this
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
        {/* double render the first few items so we can measure height, but hide them */}
        <FirstItems items={this.items} searchStore={searchStore} />
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
              isRowLoaded={searchStore.isRowLoaded}
              loadMoreRows={searchStore.loadMore}
              rowCount={searchStore.remoteRowCount}
            >
              {({ onRowsRendered, registerChild }) => (
                <SortableList
                  forwardRef={ref => {
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
                  onSortStart={this.handleSortStart}
                  onSortEnd={this.handleSortEnd}
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
