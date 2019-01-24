import { always, ensure, react } from '@mcro/black'
import { View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import {
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  WindowScroller,
} from 'react-virtualized'
import { GenericComponent } from '../../types'
import { Banner } from '../Banner'
import { HandleSelection } from '../ListItems/ListItem'
import VirtualListItem, { VirtualListItemProps } from './VirtualListItem'

export type GetItemProps = (index: number) => Partial<VirtualListItemProps<any>> | null

export type VirtualListProps = {
  onChangeHeight?: (height: number) => any
  onSelect?: HandleSelection
  onOpen?: HandleSelection
  forwardRef?: (a: any, b: VirtualListStore) => any
  items: any[]
  itemProps?: Partial<VirtualListItemProps<any>>
  getItemProps?: GetItemProps
  ItemView?: GenericComponent<VirtualListItemProps<any>>
  infinite?: boolean
  loadMoreRows?: Function
  rowCount?: number
  isRowLoaded?: Function
  maxHeight?: number
  estimatedRowHeight?: number
  scrollToAlignment?: 'auto' | 'start' | 'end' | 'center'
  scrollToIndex?: number
  padTop?: number
  sortable?: boolean
  dynamicHeight?: boolean
}

class SortableList extends React.Component<any> {
  render() {
    return <List {...this.props} ref={this.props.forwardRef} />
  }
}

const SortableListContainer = SortableContainer(SortableList, { withRef: true })

class VirtualListStore {
  props: VirtualListProps
  windowScrollerRef = React.createRef<WindowScroller>()
  listRef: List = null
  rootRef: HTMLDivElement = null
  height = 100
  width = 0
  isSorting = false
  observing = false
  cache: CellMeasurerCache = null

  resizeOnChange = react(
    () => always(this.props.items, this.cache),
    () => {
      ensure('this.listRef', !!this.listRef)
      // this.listRef.recomputeRowHeights()
      this.resizeAll()
    },
    {
      deferFirstRun: true,
    },
  )

  setRootRef = (ref: HTMLDivElement) => {
    if (this.rootRef || !ref) {
      return
    }

    this.rootRef = ref

    // measure on resize
    // @ts-ignore
    const observer = new ResizeObserver(() => {
      this.measure()
      this.measureHeight()
    })
    observer.observe(this.rootRef)

    this.measure()
  }

  doMeasureHeight = react(() => always(this.cache), this.measureHeight)

  measureTm = null

  measureHeight() {
    if (this.props.dynamicHeight) {
      if (!this.cache) {
        return
      }
      // height
      let height = 0
      for (let i = 0; i < Math.min(40, this.props.items.length); i++) {
        height += this.cache.rowHeight(i)
      }
      if (height === 0) {
        return
      }
      this.height = Math.min(this.props.maxHeight || Infinity, height)
      if (this.props.onChangeHeight) {
        this.props.onChangeHeight(this.height)
      }
    } else {
      if (this.rootRef && this.rootRef.parentNode) {
        this.height = (this.rootRef.parentNode as HTMLDivElement).clientHeight
      }
    }
  }

  measure() {
    if (!this.rootRef || this.rootRef.clientWidth === 0) {
      clearTimeout(this.measureTm)
      this.measureTm = setTimeout(this.measure)
      return
    }

    this.width = this.rootRef.clientWidth

    if (!this.cache) {
      this.cache = new CellMeasurerCache({
        defaultHeight: this.props.estimatedRowHeight,
        defaultWidth: this.width,
        fixedWidth: true,
        keyMapper: (rowIndex: number) => {
          if (typeof rowIndex === 'undefined') {
            return 0
          }
          const id = this.props.items[rowIndex].id
          if (typeof id === 'undefined') {
            return `index${rowIndex}`
          }
          return id
        },
      })
    }
  }

  resizeAll = () => {
    this.cache.clearAll()
    this.measureHeight()
  }
}

const isRightClick = e =>
  (e.buttons === 1 && e.ctrlKey === true) || // macOS trackpad ctrl click
  (e.buttons === 2 && e.button === 2) // Regular mouse or macOS double-finger tap

const getSeparatorProps = ({ items }: VirtualListProps, index: number) => {
  const model = items[index]
  if (!model.group) {
    return null
  }
  if (index === 0 || model.group !== items[index - 1].group) {
    return { separator: `${model.group}` }
  }
  return null
}

const itemProps = (props: VirtualListProps, index: number): Partial<VirtualListItemProps<any>> => {
  const next = [
    getSeparatorProps(props, index),
    index === 0 && props.padTop
      ? {
          above: <div style={{ height: props.padTop }} />,
        }
      : null,
    !props.sortable ? { disabled: true } : null,
  ].filter(Boolean)
  if (!next.length) {
    return null
  }
  let res = {}
  for (const item of next) {
    res = { ...res, ...item }
  }
  return res
}

// TODO extract useDefaultProps + DefaultProps context into helper libs

function useDefaultProps<A>(a: A, b: Partial<A>): A {
  return { ...b, ...a }
}

export const VirtualListDefaultProps = React.createContext({
  estimatedRowHeight: 60,
} as Partial<VirtualListProps>)

export default observer(function VirtualList(rawProps: VirtualListProps) {
  const defaultProps = React.useContext(VirtualListDefaultProps)
  const props = useDefaultProps(rawProps, defaultProps)
  const store = useStore(VirtualListStore, props)
  const { cache, width, height } = store

  React.useEffect(() => {
    if (!store.listRef) {
      return
    }

    let tm = setTimeout(() => {
      store.resizeAll()
      store.listRef.forceUpdateGrid()
    })

    return () => {
      clearTimeout(tm)
    }
  })

  if (!props.items.length) {
    return (
      <View flex={1} margin={[10, 0]}>
        <Banner>No results</Banner>
      </View>
    )
  }

  const rowRenderer = ({ key, index, parent, style }) => {
    const item = props.items[index]
    const ItemView = props.ItemView || VirtualListItem
    return (
      <CellMeasurer key={key} cache={cache} columnIndex={0} parent={parent} rowIndex={index}>
        <div style={style}>
          <ItemView
            onSelect={props.onSelect}
            onOpen={props.onOpen}
            {...itemProps(props, index)}
            {...props.itemProps}
            {...props.getItemProps && props.getItemProps(index)}
            {...item}
            index={index}
            realIndex={index}
          />
        </div>
      </CellMeasurer>
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
            if (props.forwardRef) {
              props.forwardRef(ref, store)
            }
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
        estimatedRowSize={props.estimatedRowHeight}
        rowRenderer={rowRenderer}
        distance={10}
        lockAxis="y"
        helperClass="sortableHelper"
        shouldCancelStart={isRightClick}
        scrollToAlignment={props.scrollToAlignment}
        scrollToIndex={props.scrollToIndex}
        {...extraProps}
      />
    )
  }

  return (
    <div
      ref={store.setRootRef}
      style={{
        height,
        width: '100%',
      }}
    >
      {!!width && !!cache && (
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
    </div>
  )
})
