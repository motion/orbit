import { always, react } from '@mcro/black'
import { ContextMenu } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { MenuItem } from 'electron'
import React, {
  Component,
  createContext,
  createRef,
  memo,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc'
import {
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  WindowScroller,
} from 'react-virtualized'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { GenericComponent } from '../../types'
import { HandleSelection } from '../ListItems/ListItem'
import VirtualListItem, { VirtualListItemProps } from './VirtualListItem'

// for some reason memo doesnt work but this does???
export const simpleEqual = (a, b) => {
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

export type VirtualListProps<A> = SortableContainerProps & {
  onChangeHeight?: (height: number) => any
  onSelect?: HandleSelection
  onOpen?: HandleSelection
  forwardRef?: (a: any, b: VirtualListStore) => any
  items: A[]
  itemProps?: Partial<VirtualListItemProps<any>>
  getContextMenu?: (index: number) => Partial<MenuItem>[]
  getItemProps?: GetItemProps<A> | null | false
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

class SortableList extends Component<any> {
  render() {
    return <List {...this.props} ref={this.props.forwardRef} />
  }
}

const SortableListContainer = SortableContainer(SortableList, { withRef: true })

class VirtualListStore {
  props: VirtualListProps<any>
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

  get frameHeight() {
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
      for (let i = 0; i < Math.min(40, this.props.items.length); i++) {
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
      if (this.frameHeight) {
        const height = Math.min(this.props.maxHeight, this.frameHeight)
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
    const id = this.props.items[rowIndex].id
    if (typeof id === 'undefined') {
      return `index${rowIndex}`
    }
    return id
  }

  triggerMeasure = 0

  runMeasure = react(
    () => [this.triggerMeasure, this.props.allowMeasure, always(this.props.items)],
    async (_, { when, sleep }) => {
      await sleep()
      await when(() => !!this.frameRef)
      if (this.cache) {
        await when(() => this.props.allowMeasure !== false)
      }
      console.warn('running measure')

      if (this.frameRef.clientWidth !== this.width) {
        this.width = this.frameRef.clientWidth
      }

      if (!this.cache) {
        this.cache = new CellMeasurerCache({
          defaultHeight: this.props.estimatedRowHeight,
          defaultWidth: this.width,
          fixedWidth: true,
          keyMapper: this.getKey,
        })
      }
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

// TODO extract useDefaultProps + DefaultProps context into helper libs

function useDefaultProps<A>(a: A, b: Partial<A>): A {
  return { ...b, ...a }
}

export const VirtualListDefaultProps = createContext({
  estimatedRowHeight: 60,
  maxHeight: window.innerHeight,
} as Partial<VirtualListProps<any>>)

const VirtualListInner = memo((props: VirtualListProps<any> & { store: VirtualListStore }) => {
  const store = useStore(props.store)
  const frameRef = useRef<HTMLDivElement>(null)
  const ElementCache = useRef(new WeakMap())

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

  if (!props.items.length) {
    return null
  }

  function getElement(item: Object, index: number) {
    let next = ElementCache.current.get(item)
    if (next) return next
    next = (
      <ContextMenu items={props.getContextMenu ? props.getContextMenu(index) : null}>
        <VirtualListItem
          // key={Math.random()}
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
    )
    ElementCache.current.set(item, next)
    return next
  }

  function rowRenderer({ key, index, parent, style }) {
    const item = props.items[index]
    const itemElement = (
      <CellMeasurer key={key} cache={store.cache} columnIndex={0} parent={parent} rowIndex={index}>
        <div style={style}>{getElement(item, index)}</div>
      </CellMeasurer>
    )
    return itemElement
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

export default function VirtualList({ allowMeasure, ...rawProps }: VirtualListProps<any>) {
  const defaultProps = useContext(VirtualListDefaultProps)
  const props = useDefaultProps(rawProps, defaultProps)
  const store = useStore(VirtualListStore, { allowMeasure, ...props })
  return <VirtualListInner {...props} store={store} />
}
