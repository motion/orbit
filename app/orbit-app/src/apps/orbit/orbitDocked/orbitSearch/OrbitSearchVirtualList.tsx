import * as React from 'react'
import {
  WindowScroller,
  List,
  CellMeasurerCache,
  CellMeasurer,
  InfiniteLoader,
} from 'react-virtualized'
import { SearchStore } from '../SearchStore'
import { view } from '@mcro/black'
import { Text } from '@mcro/ui'
import { HighlightText } from '../../../../views/HighlightText'
import { OrbitListItem } from '../../../../views/OrbitListItem'
import { handleClickLocation } from '../../../../helpers/handleClickLocation'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { Bit } from '@mcro/models'
import { reaction } from 'mobx'
import { debounce } from 'lodash'
import { ProvideHighlightsContextWithDefaults } from '../../../../helpers/contexts/HighlightsContext'

type Props = {
  scrollingElement: HTMLDivElement
  scrollToIndex?: number
  searchStore: SearchStore
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
  query: string
  style?: Object
  cache?: any
  parent?: any
  width?: number
  realIndex: number
}

const spaceBetween = <div style={{ flex: 1 }} />

const ListItem = ({ model, realIndex, query }: ListItemProps) => {
  const isConversation = model.integration === 'slack'
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
      }}
    >
      {renderListItemChildren}
    </OrbitListItem>
  )
}

class VirtualList extends React.Component<any> {
  render() {
    return <List {...this.props} ref={this.props.forwardRef} />
  }
}

const SortableListItem = SortableElement(ListItem)
const SortableList = SortableContainer(VirtualList, { withRef: true })

@view
export class OrbitSearchVirtualList extends React.Component<Props> {
  windowScrollerRef = React.createRef<WindowScroller>()
  listRef: List

  state = {
    height: 0,
  }

  private shouldResizeAll = false
  private cache = new CellMeasurerCache({
    defaultHeight: 60,
    fixedWidth: true,
  })
  private resizeOnChange = reaction(
    () => this.items && Math.random(),
    () => {
      this.listRef.forceUpdateGrid()
    },
  )

  componentDidUpdate(prevProps) {
    if (!prevProps.scrollingElement && this.props.scrollingElement) {
      this.resizeObserver.observe(this.props.scrollingElement)
      this.measure()
    }
    if (this.shouldResizeAll) {
      this.resizeAll()
    }
  }

  componentDidMount() {
    if (this.props.scrollingElement) {
      this.resizeObserver.observe(this.props.scrollingElement)
      this.measure()
    }
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect()
    this.resizeOnChange()
  }

  private offset() {
    return this.props.searchStore.quickSearchState.results.length
  }

  private measure = () => {
    if (this.props.scrollingElement.clientHeight !== this.state.height) {
      this.setState({ height: this.props.scrollingElement.clientHeight })
    }
  }
  // @ts-ignore
  resizeObserver = new ResizeObserver(this.measure)

  private rowRenderer = ({ index, parent, key, style }) => {
    const { searchStore } = this.props
    return (
      <CellMeasurer
        key={key}
        cache={this.cache}
        columnIndex={0}
        parent={parent}
        rowIndex={index}
        width={this.cache}
      >
        <div style={style}>
          <SortableListItem
            key={key}
            model={this.items[index]}
            index={index}
            realIndex={index + this.offset}
            query={searchStore.activeQuery}
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

  render() {
    const { scrollToIndex, scrollingElement, searchStore } = this.props
    // double render the first few items so we can measure height, but hide them
    const firstItems = this.items
      .slice(0, 10)
      .map((item, index) => (
        <ListItem
          key={item.id}
          model={item}
          realIndex={index + this.offset}
          query={searchStore.activeQuery}
        />
      ))
    return (
      <ProvideHighlightsContextWithDefaults
        value={{ words: searchStore.activeQuery.split(' '), maxChars: 500, maxSurroundChars: 80 }}
      >
        <div
          style={{
            opacity: 0,
            pointerEvents: 'none',
            zIndex: -1,
          }}
        >
          {firstItems}
        </div>
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
                      console.log('loading listRef', ref)
                      registerChild(ref)
                      this.listRef = ref
                    }
                  }}
                  items={this.items}
                  deferredMeasurementCache={this.cache}
                  height={this.state.height}
                  width={scrollingElement.clientWidth}
                  rowHeight={this.cache.rowHeight}
                  overscanRowCount={20}
                  rowCount={this.items.length}
                  estimatedRowSize={100}
                  rowRenderer={this.rowRenderer}
                  scrollToIndex={scrollToIndex}
                  distance={20}
                  onRowsRendered={onRowsRendered}
                />
              )}
            </InfiniteLoader>
          </div>
        )}
      </ProvideHighlightsContextWithDefaults>
    )
  }
}
