import { SortableContainer, SortableContainerProps } from '@mcro/react-sortable-hoc'
import { always, cancel, react, useStore } from '@mcro/use-store'
import { MenuItem } from 'electron'
import React, {
  Component,
  createContext,
  createRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react'
import {
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  WindowScroller,
} from 'react-virtualized'
import { ContextMenu } from '../ContextMenu'
import { useResizeObserver } from '../hooks/useResizeObserver'
import { GenericComponent } from '../types'
import { HandleSelection } from './ListItem'
import VirtualListItem, { VirtualListItemProps } from './VirtualListItem'

// for some reason memo doesnt work but this does???
export const simpleEqual = (a: Object, b: Object) => {
  for (const key in b) {
    if (a[key] !== b[key]) {
      return false
    }
  }
  return true
}

export type GetItemProps<A> = (
  item: A,
  index: number,
  items: A[],
) => Partial<VirtualListItemProps<A>> | null

type VirtualProps = {
  onChangeHeight?: (height: number) => any
  onSelect?: HandleSelection
  onOpen?: HandleSelection
  forwardRef?: (a: any, b: VirtualListStore) => any
  itemProps?: Partial<VirtualListItemProps<any>>
  getContextMenu?: (index: number) => Partial<MenuItem>[]
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
  keyMapper?: (index: number) => string | number
  allowMeasure?: boolean
}

export type VirtualListProps<A> = SortableContainerProps &
  VirtualProps & {
    items: A[]
    getItemProps?: GetItemProps<A> | null | false
  }

class SortableList extends Component<any> {
  render() {
    return <List {...this.props} ref={this.props.forwardRef} />
  }
}

const SortableListContainer = SortableContainer(SortableList, { withRef: true })

class VirtualListStore {
  props: VirtualProps & {
    getItem: (i: number) => any
    numItems: number
  }

  windowScrollerRef = createRef<WindowScroller>()
  listRef: List = null
  frameRef: HTMLDivElement = null
  height = window.innerHeight
  width = 0
  isSorting = false
  observing = false
  cache: CellMeasurerCache = null

  setFrameRef = (ref: HTMLDivElement) => {
    if (this.frameRef || !ref) return
    this.frameRef = ref
    this.measure()
  }

  getFrameHeight() {
    if (!this.frameRef) {
      return window.innerHeight
    }
    return this.frameRef.clientHeight
  }

  doMeasureHeight = react(() => always(this.cache, this.frameRef), this.measureHeight)
  measureHeight() {
    if (this.props.dynamicHeight) {
      if (!this.cache) return
      // height
      let height = 0
      for (let i = 0; i < Math.min(40, this.props.numItems); i++) {
        height += this.cache.rowHeight(i)
      }
      if (height === 0) return

      height = Math.min(this.props.maxHeight, height)

      if (height !== this.height) {
        this.height = height
        if (this.props.onChangeHeight) {
          this.props.onChangeHeight(this.height)
        }
      }
    } else {
      if (this.getFrameHeight()) {
        const height = Math.min(this.props.maxHeight, this.getFrameHeight())
        this.height = height
      }
    }
  }

  getKey = (rowIndex: number) => {
    if (this.props.keyMapper) {
      return this.props.keyMapper(rowIndex)
    }
    if (typeof rowIndex === 'undefined') {
      return 0
    }
    if (!this.props.getItem(rowIndex)) {
      return rowIndex
    }
    const id = this.props.getItem(rowIndex).id
    if (typeof id === 'undefined') {
      return `index${rowIndex}`
    }
    return id
  }

  triggerMeasure = 0

  runMeasure = react(
    () => [this.triggerMeasure, this.props.allowMeasure],
    async (_, { when, sleep }) => {
      if (this.props.allowMeasure === false) {
        throw cancel
      }
      await sleep()
      await when(() => !!this.frameRef)

      if (this.frameRef.clientWidth !== this.width) {
        this.width = this.frameRef.clientWidth
      }

      if (!this.cache) {
        this.cache = new CellMeasurerCache({
          defaultHeight: this.props.estimatedRowHeight,
          defaultWidth: this.width,
          fixedWidth: true,
          // keyMapper: this.getKey,
        })
      }
    },
  )

  recomputeHeights = 0
  runRecomputeHeights = react(
    () => [this.recomputeHeights],
    async (_, { when, sleep }) => {
      await sleep()
      await when(() => this.props.allowMeasure !== false)
      await when(() => !!this.listRef)
      console.warn('recomputing heights for', this.props)
      this.cache.clearAll()
      this.listRef.recomputeRowHeights()
    },
  )

  measure() {
    this.triggerMeasure = Date.now()
  }

  resizeAll = () => {
    console.trace('resize all')
    this.cache.clearAll()
    this.measureHeight()
  }
}

const isRightClick = e =>
  (e.buttons === 1 && e.ctrlKey === true) || // macOS trackpad ctrl click
  (e.buttons === 2 && e.button === 2) // Regular mouse or macOS double-finger tap

const getSeparatorProps = ({ items }: VirtualListProps<any>, index: number) => {
  const model = items[index]
  if (!model.group) {
    return null
  }
  if (index === 0 || model.group !== items[index - 1].group) {
    return { separator: `${model.group}` }
  }
  return null
}

const itemProps = (
  props: VirtualListProps<any>,
  index: number,
): Partial<VirtualListItemProps<any>> => {
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

export const VirtualListDefaultProps = createContext({
  estimatedRowHeight: 60,
  maxHeight: window.innerHeight,
} as Partial<VirtualListProps<any>>)

const VirtualListInner = memo((props: VirtualListProps<any> & { store: VirtualListStore }) => {
  const store = useStore(props.store)
  const frameRef = useRef<HTMLDivElement>(null)

  useResizeObserver(frameRef, () => {
    store.measure()
    store.measureHeight()
  })

  useEffect(
    () => {
      store.setFrameRef(frameRef.current)
    },
    [frameRef.current],
  )

  useEffect(
    () => {
      store.recomputeHeights = Date.now()
    },
    [props.items],
  )

  if (!props.items.length) {
    return null
  }

  function rowRenderer({ key, index, parent, style }) {
    const item = props.items[index]
    return (
      <CellMeasurer key={key} cache={store.cache} columnIndex={0} parent={parent} rowIndex={index}>
        <div style={style}>
          <ContextMenu items={props.getContextMenu ? props.getContextMenu(index) : null}>
            <VirtualListItem
              ItemView={props.ItemView}
              onSelect={props.onSelect}
              onOpen={props.onOpen}
              {...itemProps(props, index)}
              {...props.itemProps}
              {...props.getItemProps && props.getItemProps(item, index, props.items)}
              {...item}
              index={index}
              realIndex={index}
            />
          </ContextMenu>
        </div>
      </CellMeasurer>
    )
  }

  function getList(infiniteProps?) {
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
        deferredMeasurementCache={store.cache}
        height={store.height}
        width={store.width}
        rowHeight={store.cache.rowHeight}
        overscanRowCount={5}
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
      ref={frameRef}
      style={{
        height: props.dynamicHeight ? store.height : 'auto',
        flex: props.dynamicHeight ? 'none' : 1,
        width: '100%',
      }}
    >
      {!!store.width && !!store.cache && (
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
}, simpleEqual)

// use this outer wrapper because changing allowMeasure otherwise would trigger renders
// renders are expensive for this component, and especially that because it happens on click
// this lets us separate out and have the inner just react to props it should

export function VirtualList({ allowMeasure, items, ...rawProps }: VirtualListProps<any>) {
  const defaultProps = useContext(VirtualListDefaultProps)
  const props = { ...defaultProps, ...rawProps }
  const getItem = useCallback(index => items[index], [items])
  const store = useStore(VirtualListStore, {
    numItems: items.length,
    getItem,
    allowMeasure,
    ...(props as any),
  })
  return <VirtualListInner {...props} items={items} store={store} />
}
