import { SortableContainer, SortableContainerProps } from '@o/react-sortable-hoc'
import { idFn, selectDefined } from '@o/utils'
import memoize from 'memoize-one'
import React, { forwardRef, FunctionComponent, memo, RefObject, useCallback, useRef } from 'react'

import { defaultSortPressDelay } from '../constants'
import { Config } from '../helpers/configureUI'
import { createContextualProps } from '../helpers/createContextualProps'
import { rowItemCompare } from '../helpers/rowItemCompare'
import { GenericComponent } from '../types'
import { DynamicListControlled, DynamicListProps } from './DynamicList'
import { HandleSelection } from './ListItemViewProps'
import { SelectableDynamicList } from './SelectableList'
import { SelectableProps, SelectableStore } from './SelectableStore'
import { VirtualListItem } from './VirtualListItem'

export type VirtualListProps<A = any, B = any> = SelectableProps &
  SortableContainerProps &
  Omit<DynamicListProps, 'children' | 'itemCount' | 'itemData'> & {
    onSelect?: HandleSelection
    onOpen?: HandleSelection

    /** Additional props */
    itemProps?: B

    /** Custom view for children */
    ItemView?: GenericComponent<A>

    /** Enable drag to sort */
    sortable?: boolean

    /** react-window list ref */
    listRef?: RefObject<DynamicListControlled>

    /** Filter by search string */
    items: A[]

    /** Dynamically add extra props to each item */
    getItemProps?: (item: A, index: number, items: A[]) => B | null | false

    /** Custom separator element */
    Separator?: FunctionComponent<{ children: string }>

    /** Pass props to the separator */
    separatorProps?: any
  }

const SortableList = SortableContainer(SelectableDynamicList, { withRef: true })

const { useProps } = createContextualProps<Partial<VirtualListProps>>()

const ListRow = memo(
  forwardRef((props: any, ref) => {
    const { data, index, style } = props
    const { items, listProps } = data
    const selectableStore: SelectableStore = data.selectableStore
    const { getItemProps, ItemView, sortable, onSelect, onOpen, itemProps } = listProps
    const item = items[index]
    const dynamicProps = getItemProps && getItemProps(item, index, items)
    const finishSelect = useRef(false)
    const onMouseUp = selectDefined(
      dynamicProps ? dynamicProps.onMouseUp : undefined,
      itemProps ? itemProps.onMouseUp : undefined,
      idFn,
    )
    const onMouseDown = selectDefined(
      dynamicProps ? dynamicProps.onMouseDown : undefined,
      itemProps ? itemProps.onMouseDown : undefined,
      idFn,
    )
    const onMouseEnter = selectDefined(
      dynamicProps ? dynamicProps.onMouseEnter : undefined,
      itemProps ? itemProps.onMouseEnter : undefined,
      idFn,
    )
    return (
      <VirtualListItem
        forwardRef={ref}
        key={Config.getItemKey(item, index)}
        ItemView={ItemView}
        onClick={useCallback(e => onSelect && onSelect(index, e), [])}
        onDoubleClick={useCallback(e => onOpen && onOpen(index, e), [])}
        disabled={!sortable}
        {...getSeparatorProps(listProps, items, item, index)}
        // base props
        {...itemProps}
        {...item}
        {...dynamicProps}
        // our overrides that fallback
        onMouseUp={useCallback(e => {
          if (finishSelect.current) {
            finishSelect.current = false
            selectableStore && selectableStore.setRowActive(index, e)
          }
          onMouseUp(e)
        }, [])}
        onMouseDown={useCallback(
          e => {
            e.persist()
            // add delay when sortable
            const setRowActive = () => {
              selectableStore && selectableStore.setRowMouseDown(index, e)
              finishSelect.current = false
            }
            if (sortable) {
              finishSelect.current = true
            }
            setRowActive()
            onMouseDown(e)
          },
          [sortable, onMouseDown],
        )}
        onMouseEnter={useCallback(e => {
          selectableStore && selectableStore.onHoverRow(index)
          onMouseEnter(e)
        }, [])}
        // cant override
        selectableStore={selectableStore}
        index={index}
        realIndex={index}
        style={style}
      />
    )
  }),
  rowItemCompare,
)

const createItemData = memoize(
  (items: any[], selectableStore: SelectableStore, listProps: VirtualListProps) => {
    return {
      items,
      listProps,
      selectableStore,
    }
  },
)

const getPressDelay = (props: VirtualListProps) =>
  selectDefined(props.pressDelay, defaultSortPressDelay)

// this memo seems to help most of the extraneous renders
export const VirtualList = memo((virtualProps: VirtualListProps) => {
  const props = useProps(virtualProps)
  const { onSortStart, onSortEnd, selectableStore } = props
  const sortableContainerRef = useRef(null)
  const isForcingSortEnd = useRef(false)

  // key safety
  if (process.env.NODE_ENV === 'development' && props.sortable) {
    if (props.items.some((x, i) => Config.getItemKey(x, i) === i)) {
      throw new Error(
        `Must provide a key or id property to all items when you have a sortable list.`,
      )
    }
  }

  return (
    <SortableList
      ref={sortableContainerRef}
      selectableStore={selectableStore}
      itemCount={props.items.length}
      itemData={createItemData(props.items, selectableStore, props)}
      lockAxis="y"
      helperClass="sortableHelper"
      {...props}
      pressDelay={getPressDelay(props)}
      // see selectableStore "// distance move until cancel"
      // pressThreshold={8}
      onSortStart={useCallback(
        (sort, event) => {
          if (selectableStore.state === 'selecting') {
            isForcingSortEnd.current = true
            sortableContainerRef.current.handleSortEnd()
            return event.preventDefault()
          }
          selectableStore && selectableStore.setSorting(true)
          onSortStart && onSortStart(sort, event)
        },
        [onSortStart],
      )}
      onSortEnd={useCallback(
        (sort, event) => {
          if (isForcingSortEnd.current) {
            isForcingSortEnd.current = false
            return
          }
          selectableStore && selectableStore.setSorting(false)
          if (selectableStore.state === 'selecting') return
          onSortEnd && onSortEnd(sort, event)
        },
        [onSortStart],
      )}
      shouldCancelStart={useCallback(e => {
        if (isRightClick(e)) {
          return true
        }
        return selectableStore && selectableStore.state === 'selecting'
      }, [])}
    >
      {ListRow as any}
    </SortableList>
  )
})

const isRightClick = e =>
  (e.buttons === 1 && e.ctrlKey === true) || // macOS trackpad ctrl click
  (e.buttons === 2 && e.button === 2) // Regular mouse or macOS double-finger tap

const getSeparatorProps = (props: VirtualListProps, items: any[], item: any, index: number) => {
  if (!item || !item.groupName) {
    return null
  }
  const Separator = props.Separator
  if (index === 0 || item.groupName !== items[index - 1].groupName) {
    const name = `${item.groupName}`
    return { separator: Separator ? <Separator {...props.separatorProps}>{name}</Separator> : name }
  }
  return null
}
