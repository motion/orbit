import * as React from 'react'
import { WindowScroller, AutoSizer, List, CellMeasurerCache, CellMeasurer } from 'react-virtualized'
import { SearchStore } from '../SearchStore'
import { view } from '@mcro/black'
import { Text } from '@mcro/ui'
import { HighlightText } from '../../../../views/HighlightText'
import { OrbitListItem } from '../../../../views/OrbitListItem'
import { handleClickLocation } from '../../../../helpers/handleClickLocation'
import { ORBIT_WIDTH } from '@mcro/constants'
import { PointerEventsProperty } from 'csstype'

type Props = {
  scrollingElement: HTMLDivElement
  scrollToIndex?: number
  offset: number
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

const ListItem = ({ model, index, offset, query }) => {
  const isConversation = model.integration === 'slack'
  return (
    <OrbitListItem
      pane={name}
      subPane="search"
      key={model.id}
      index={index + offset}
      model={model}
      hide={isConversation ? hideSlack : null}
      subtitleSpaceBetween={<div style={{ flex: 1 }} />}
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

const OrbitCardContent = view({
  padding: [6, 0],
  flex: 1,
  overflow: 'hidden',
  whiteSpace: 'pre',
})

const SearchResultText = props => <Text wordBreak="break-all" fontWeight={400} {...props} />
const collapseWhitespace = str => (typeof str === 'string' ? str.replace(/\n[\s]*/g, ' ') : str)

@view
export class OrbitSearchVirtualList extends React.Component<Props> {
  windowScrollerRef = React.createRef<WindowScroller>()
  listRef = React.createRef<List>()

  state = {
    height: 0,
  }

  private lastWidth = 0
  private shouldResizeAll = false
  private cache = new CellMeasurerCache({
    defaultHeight: 60,
    fixedWidth: true,
  })

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

  compoenntWillUnmount() {
    this.resizeObserver.disconnect()
  }

  private measure = () => {
    if (this.props.scrollingElement.clientHeight !== this.state.height) {
      this.setState({ height: this.props.scrollingElement.clientHeight })
    }
  }
  // @ts-ignore
  resizeObserver = new ResizeObserver(this.measure)

  private rowRenderer = ({ index, parent, key, style }) => {
    const { searchStore, offset } = this.props
    const row = this.items[index]
    return (
      <CellMeasurer
        cache={this.cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
        width={this.lastWidth}
      >
        <div style={style}>
          <ListItem
            key={`${key}item`}
            model={row}
            index={index}
            offset={offset}
            query={searchStore.activeQuery}
          />
        </div>
      </CellMeasurer>
    )
  }

  get items() {
    return this.props.searchStore.searchState.results || []
  }

  private resizeAll = () => {
    this.shouldResizeAll = false
    this.cache.clearAll()
    if (this.listRef.current) {
      this.listRef.current.recomputeRowHeights()
    }
  }

  render() {
    const { scrollToIndex, scrollingElement, searchStore } = this.props
    console.log('items...', this, scrollingElement, this.state.height)
    const shouldVirtualize = this.items.length > 10
    // always render the first 10 items so we can measure and show height accurately
    const firstItems = this.items.map((item, index) => (
      <ListItem
        key={item.id}
        model={item}
        index={index}
        offset={this.props.offset}
        query={searchStore.activeQuery}
      />
    ))
    if (!this.state.height) {
      return firstItems
    }
    return (
      <>
        <div
          style={
            shouldVirtualize
              ? {
                  opacity: 0,
                  pointerEvents: 'none',
                  zIndex: -1,
                }
              : null
          }
        >
          {firstItems}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1,
            pointerEvents: shouldVirtualize ? 'inherit' : 'none',
          }}
        >
          <List
            ref={this.listRef}
            deferredMeasurementCache={this.cache}
            height={this.state.height}
            width={scrollingElement.clientWidth}
            rowHeight={this.cache.rowHeight}
            overscanRowCount={20}
            rowCount={this.items.length}
            estimatedRowSize={100}
            rowRenderer={this.rowRenderer}
            scrollToIndex={scrollToIndex}
          />
        </div>
      </>
    )
  }
}
