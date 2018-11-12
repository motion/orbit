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

export type ItemPropsMinimum = Pick<ItemProps<any>, 'appType' | 'appConfig'> &
  Partial<ItemProps<any>>
export type GetItemProps = (index: number) => ItemPropsMinimum

type Props = {
  items: any[]
  itemProps?: ItemProps<any>
  getItemProps?: GetItemProps
  appStore?: AppStore
  subPaneStore?: SubPaneStore
  ItemView?: GenericComponent<any>
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
      return
    }
    if (this.listRef) {
      this.listRef.recomputeRowHeights()
    }
    // height
    let height = 0
    for (let i = 0; i < Math.min(40, this.props.items.length); i++) {
      height += this.cache.rowHeight(i)
    }
    this.height = Math.min(this.props.maxHeight, height) // todo: make 1000 for temporary fix
  }

  keyMapper = rowIndex => {
    if (typeof rowIndex === 'undefined') {
      return 0
    }
    const id = this.props.items[rowIndex].id
    if (typeof id === 'undefined') {
      throw new Error('No valid id found for mapping results')
    }
    return id
  }

  setRootRef = ref => {
    this.rootRef = ref
    if (ref) {
      // width
      if (this.width === 0) {
        const width = this.rootRef.clientWidth
        this.cache = new CellMeasurerCache({
          // defaultHeight: 60,
          defaultWidth: width,
          fixedWidth: true,
          keyMapper: this.keyMapper,
        })
        this.width = width
      }
      this.measure()
    }
  }

  private resizeAll = () => {
    this.cache.clearAll()
    if (this.listRef) {
      this.measure()
    }
  }
}

const isRightClick = e =>
  (e.buttons === 1 && e.ctrlKey === true) || // macOS trackpad ctrl click
  (e.buttons === 2 && e.button === 2) // Regular mouse or macOS double-finger tap

export function VirtualList(props: Props) {
  const context = React.useContext(StoreContext)
  const store = useStore(VirtualListStore, { ...props, appStore: context.appStore })
  const { cache, width, height } = store

  const rowRenderer = ({ index, parent, style }) => {
    const model = props.items[index]
    const ItemView = props.ItemView || VirtualListItem
    return (
      <CellMeasurer
        key={`${model.id}${index}`}
        cache={cache}
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
            {...props.itemProps}
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
        deferredMeasurementCache={cache}
        height={height}
        width={width}
        rowHeight={cache.rowHeight}
        overscanRowCount={20}
        rowCount={props.items.length}
        estimatedRowSize={100}
        rowRenderer={rowRenderer}
        pressDelay={120}
        pressThreshold={17}
        lockAxis="y"
        shouldCancelStart={isRightClick}
        {...extraProps}
      />
    )
  }

  return (
    <div
      ref={store.setRootRef}
      style={{
        height: height,
      }}
    >
      {!!width && (
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
      {!width && <div>No width!</div>}
    </div>
  )
}
