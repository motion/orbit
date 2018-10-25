import * as React from 'react'
import { WindowScroller, List, CellMeasurerCache, CellMeasurer } from 'react-virtualized'
import { SearchStore } from '../../pages/OrbitPage/orbitDocked/SearchStore'
import { view, ensure } from '@mcro/black'
import { View } from '@mcro/ui'
import { SortableContainer } from 'react-sortable-hoc'
import { reaction } from 'mobx'
import { debounce } from 'lodash'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { SelectionStore } from '../../pages/OrbitPage/orbitDocked/SelectionStore'
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

@view.attach('searchStore', 'selectionStore', 'subPaneStore')
@view
export class SortableList extends React.Component<Props> {
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
        key={`${model.id}${index}`}
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
            itemProps={this.props.itemProps}
          />
        </div>
      </CellMeasurer>
    )
  }

  get items() {
    return this.props.items || []
  }

  private resizeAll = debounce(() => {
    this.shouldResizeAll = false
    this.cache.clearAll()
    if (this.listRef) {
      this.listRef.recomputeRowHeights()
    }
  })

  render() {
    const { searchStore } = this.props
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
            <SortableListContainer
              forwardRef={ref => {
                if (ref) {
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
              lockAxis="y"
            />
          </div>
        )}
      </ProvideHighlightsContextWithDefaults>
    )
  }
}
