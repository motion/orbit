import * as React from 'react'
import { WindowScroller, List, CellMeasurerCache, CellMeasurer } from 'react-virtualized'
import { SearchStore } from '../../stores/SearchStore'
import { view, ensure, react, attach } from '@mcro/black'
import { View } from '@mcro/ui'
import { SortableContainer } from 'react-sortable-hoc'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { SelectionStore } from '../../stores/SelectionStore'
import { OrbitItemSingleton } from '../OrbitItemStore'
import { SubPaneStore } from '../../pages/OrbitPage/SubPaneStore'
import { Banner } from '../Banner'
import { SortableListItem } from './SortableListItem'
import { FirstItems } from './FirstItems'
import { ItemProps } from '../OrbitItemProps'

type Props = {
  items?: any[]
  itemProps?: ItemProps<any>
  searchStore?: SearchStore
  selectionStore?: SelectionStore
  subPaneStore?: SubPaneStore
}

class VirtualList extends React.Component<any> {
  render() {
    return <List {...this.props} ref={this.props.forwardRef} />
  }
}
const SortableListContainer = SortableContainer(VirtualList, { withRef: true })

class SortableListStore {
  props: Props
  windowScrollerRef = React.createRef<WindowScroller>()
  listRef = React.createRef<List>()
  height = 0
  isSorting = false
  observing = false
  // @ts-ignore
  resizeObserver = new ResizeObserver(() => this.measure)
  cache = new CellMeasurerCache({
    defaultHeight: 60,
    fixedWidth: true,
  })

  resizeOnChange = react(
    () => this.props.items && Math.random(),
    () => {
      ensure('this.listRef', !!this.listRef.current)
      this.resizeAll()
    },
  )

  scrollToRow = react(
    () => this.props.selectionStore.activeIndex - this.offset,
    index => {
      ensure('not clicked', Date.now() - OrbitItemSingleton.lastClick > 50)
      ensure('valid index', index > -1)
      ensure('has list', !!this.listRef.current)
      this.listRef.current.scrollToRow(index)
    },
  )

  get paneNode() {
    return this.props.subPaneStore.paneNode
  }

  willUnmount() {
    this.resizeObserver.disconnect()
  }

  observePaneSize = react(
    () => this.props.subPaneStore.paneNode,
    node => {
      ensure('node', !!node)
      ensure('!this.observing', !this.observing)
      this.observing = true
      this.resizeObserver.observe(node)
      this.measure()
    },
  )

  get offset() {
    return 0
  }

  get items() {
    return this.props.items || []
  }

  private measure = () => {
    console.log('measure', this.paneNode.clientHeight)
    if (this.paneNode.clientHeight !== this.height) {
      this.height = this.paneNode.clientHeight
    }
  }

  private resizeAll = () => {
    this.cache.clearAll()
    if (this.listRef.current) [this.listRef.current.recomputeRowHeights()]
  }
}

@attach('searchStore', 'selectionStore', 'subPaneStore')
@attach({
  store: SortableListStore,
})
@view
export class SortableList extends React.Component<Props & { store?: SortableListStore }> {
  private rowRenderer = ({ index, parent, style }) => {
    const { searchStore, store } = this.props
    const model = store.items[index]
    return (
      <CellMeasurer
        key={`${model.id}${index}`}
        cache={store.cache}
        columnIndex={0}
        parent={parent}
        rowIndex={index}
        width={store.cache}
      >
        <div style={style}>
          <SortableListItem
            model={model}
            index={index}
            realIndex={index + store.offset}
            query={searchStore.searchState.query}
            {...this.props.itemProps}
          />
        </div>
      </CellMeasurer>
    )
  }

  render() {
    const { store, searchStore, itemProps } = this.props
    if (!store.items.length) {
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
        <FirstItems items={store.items} searchStore={searchStore} itemProps={itemProps} />
        {!!store.height && (
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
            <SortableListContainer
              forwardRef={store.listRef}
              items={store.items}
              deferredMeasurementCache={store.cache}
              height={store.height}
              width={store.paneNode.clientWidth}
              rowHeight={store.cache.rowHeight}
              overscanRowCount={20}
              rowCount={store.items.length}
              estimatedRowSize={100}
              rowRenderer={this.rowRenderer}
              pressDelay={120}
              pressThreshold={17}
              lockAxis="y"
            />
          </div>
        )}
      </ProvideHighlightsContextWithDefaults>
    )
  }
}
