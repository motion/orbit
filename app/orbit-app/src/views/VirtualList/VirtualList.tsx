import * as React from 'react'
import {
  WindowScroller,
  List,
  CellMeasurerCache,
  CellMeasurer,
  InfiniteLoader,
} from 'react-virtualized'
import { ensure, react, StoreContext } from '@mcro/black'
import { View } from '@mcro/ui'
import { SortableContainer } from 'react-sortable-hoc'
import { OrbitItemSingleton } from '../OrbitItemStore'
import { SubPaneStore } from '../../components/SubPaneStore'
import { Banner } from '../Banner'
import { VirtualListItem } from './VirtualListItem'
import { ItemProps } from '../OrbitItemProps'
import { App } from '@mcro/stores'
import { AppStore } from '../../apps/AppStore'
import { useStore } from '@mcro/use-store'
import { GenericComponent } from '../../types'

export type GetItemProps = (index: number) => ItemProps<any>

type Props = {
  items: any[]
  itemProps?: ItemProps<any>
  getItemProps?: GetItemProps
  appStore?: AppStore
  subPaneStore?: SubPaneStore
  ItemView?: GenericComponent<ItemProps<any>>
  infinite?: boolean
  loadMoreRows?: Function
  rowCount?: number
  isRowLoaded?: Function
  maxHeight: number
}

class InnerList extends React.Component<any> {
  render() {
    return <List {...this.props} ref={this.props.forwardRef} />
  }
}
const SortableListContainer = SortableContainer(InnerList, { withRef: true })

class VirtualListStore {
  props: Props
  windowScrollerRef = React.createRef<WindowScroller>()
  listRef: List = null
  rootRef: HTMLDivElement = null
  height = 100
  width = 0
  isSorting = false
  observing = false
  cache: CellMeasurerCache = null

  resizeOnChange = react(
    () => this.props.items && Math.random(),
    () => {
      ensure('this.listRef', !!this.listRef)
      this.resizeAll()
      this.measure()
    },
  )

  scrollToRow = react(
    () => this.props.appStore.activeIndex,
    index => {
      ensure('not clicked', Date.now() - OrbitItemSingleton.lastClick > 50)
      ensure('valid index', index > -1)
      ensure('has list', !!this.listRef)
      this.listRef.scrollToRow(index)
    },
  )

  measure = () => {
    if (!this.rootRef) {
      console.log('no ref yet...')
      return
    }

    // width
    if (this.width === 0) {
      const width = this.rootRef.clientWidth
      this.cache = new CellMeasurerCache({
        defaultHeight: 60,
        defaultWidth: width,
        fixedWidth: true,
      })
      this.width = width
    }

    // height
    let height = 0
    for (const [index] of this.props.items.entries()) {
      if (index > 40) break
      height += this.cache.rowHeight(index)
    }
    this.height = Math.min(this.props.maxHeight, height)
  }

  setRootRef = ref => {
    this.rootRef = ref
    if (ref) {
      this.measure()
    }
  }

  private resizeAll = () => {
    this.cache.clearAll()
    if (this.listRef) {
      this.listRef.recomputeRowHeights()
      this.measure()
    }
  }
}

export function VirtualList(props: Props) {
  const context = React.useContext(StoreContext)
  console.log('context', context)
  const store = useStore(VirtualListStore, { ...props, appStore: context.appStore })

  const rowRenderer = ({ index, parent, style }) => {
    const model = props.items[index]
    const ItemView = props.ItemView || VirtualListItem
    return (
      <CellMeasurer
        key={`${model.id}${index}`}
        cache={store.cache}
        columnIndex={0}
        parent={parent}
        rowIndex={index}
      >
        <div style={style}>
          <ItemView
            model={model}
            index={index}
            realIndex={index}
            query={App.state.query}
            itemProps={props.itemProps}
            {...props.getItemProps && props.getItemProps(index)}
          />
        </div>
      </CellMeasurer>
    )
  }

  if (!props.items.length) {
    return (
      <View margin={[10, 0]}>
        <Banner>No results</Banner>
      </View>
    )
  }

  const getList = (infiniteProps?) => {
    let extraProps = {} as any
    if (infiniteProps && infiniteProps.onRowsRendered) {
      extraProps.onRowsRendered = infiniteProps.onRowsRendered
    }
    return (
      <SortableListContainer
        forwardRef={ref => {
          if (ref) {
            store.listRef = ref
            if (infiniteProps && infiniteProps.registerChild) {
              infiniteProps.registerChild(ref)
            }
          }
        }}
        items={props.items}
        deferredMeasurementCache={store.cache}
        height={store.height}
        width={store.width}
        rowHeight={store.cache.rowHeight}
        overscanRowCount={20}
        rowCount={props.items.length}
        estimatedRowSize={100}
        rowRenderer={rowRenderer}
        pressDelay={120}
        pressThreshold={17}
        lockAxis="y"
        {...extraProps}
      />
    )
  }

  return (
    <div
      ref={store.setRootRef}
      style={{
        height: store.height,
      }}
    >
      {!!store.width && (
        <>
          {props.infinite && (
            <InfiniteLoader
              isRowLoaded={props.isRowLoaded}
              loadMoreRows={props.loadMoreRows}
              rowCount={props.rowCount}
            >
              {getList}
            </InfiniteLoader>
          )}
          {!props.infinite && getList()}
        </>
      )}
      {!store.width && <div>No width!</div>}
    </div>
  )
}
