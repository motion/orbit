import { isEqual } from '@o/fast-compare'
import { SortableContainer, SortableContainerProps } from '@o/react-sortable-hoc'
import { idFn, selectDefined } from '@o/utils'
import memoize from 'memoize-one'
import React, { forwardRef, memo, RefObject, useCallback } from 'react'

import { Config } from '../helpers/configure'
import { createContextualProps } from '../helpers/createContextualProps'
import { GenericComponent, Omit } from '../types'
import { DynamicListControlled, DynamicListProps } from './DynamicList'
import { ListItemProps } from './ListItem'
import { HandleSelection } from './ListItemSimple'
import { SelectableDynamicList } from './SelectableList'
import { SelectableProps, SelectableStore, useSelectableStore } from './SelectableStore'
import { VirtualListItem } from './VirtualListItem'

export type VirtualListProps<A = any> = SelectableProps &
  SortableContainerProps &
  Omit<DynamicListProps, 'children' | 'itemCount' | 'itemData'> & {
    onSelect?: HandleSelection
    onOpen?: HandleSelection

    /** Additional props */
    itemProps?: Partial<ListItemProps>

    /** Custom view for children */
    ItemView?: GenericComponent<A>

    /** Enable drag to sort */
    sortable?: boolean

    /** react-window list ref */
    listRef?: RefObject<DynamicListControlled>

    /** Filter by search string */
    items: A[]

    /** Dynamically add extra props to each item */
    getItemProps?: (item: ListItemProps, index: number, items: A[]) => ListItemProps | null | false
  }

const SortableList = SortableContainer(SelectableDynamicList, { withRef: true })

const { useProps } = createContextualProps<Partial<VirtualListProps>>()

const ListRow = memo(
  forwardRef(({ data, index, style }: any, ref) => {
    const { selectableStore, items, listProps } = data
    const { getItemProps, ItemView, sortable, onSelect, onOpen, pressDelay, itemProps } = listProps
    const item = items[index]
    let mouseDownTm = null

    const dynamicProps = getItemProps && getItemProps(item, index, items)

    let finishSelect = false

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
        key={Config.getItemKey(item)}
        ItemView={ItemView}
        onClick={useCallback(e => onSelect(index, e), [])}
        onDoubleClick={useCallback(e => onOpen(index, e), [])}
        disabled={!sortable}
        {...getSeparatorProps(items, item, index)}
        // base props
        {...itemProps}
        {...item}
        {...dynamicProps}
        // our overrides that fallback
        onMouseUp={useCallback(e => {
          clearTimeout(mouseDownTm)
          if (finishSelect) {
            finishSelect = false
            selectableStore && selectableStore.setRowActive(index, e)
          }
          onMouseUp(e)
        }, [])}
        onMouseDown={useCallback(e => {
          e.persist()
          clearTimeout(mouseDownTm)
          // add delay when sortable
          const setRowActive = () => {
            selectableStore && selectableStore.setRowMouseDown(index, e)
            finishSelect = false
          }
          if (sortable) {
            finishSelect = true
            mouseDownTm = setTimeout(setRowActive, pressDelay)
          } else {
            setRowActive()
          }
          onMouseDown(e)
        }, [])}
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
  // for some reason with dynamiclist, react-window sends new objects with same values
  // so we just stringify compare the style
  ({ style: a, ...restA }, { style: b, ...restB }) => {
    return isEqual(restA, restB) && JSON.stringify(a) === JSON.stringify(b)
  },
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

export function VirtualList(virtualProps: VirtualListProps) {
  const props = useProps(virtualProps)
  const { onSortStart, onSortEnd } = props
  const selectableStore = useSelectableStore(props)

  return (
    <SortableList
      selectableStore={selectableStore}
      itemCount={props.items.length}
      itemData={createItemData(props.items, selectableStore, props)}
      shouldCancelStart={isRightClick}
      lockAxis="y"
      {...props}
      pressDelay={selectDefined(props.pressDelay, 0)}
      onSortStart={useCallback(
        (sort, event) => {
          selectableStore.setSorting(true)
          onSortStart && onSortStart(sort, event)
        },
        [onSortStart],
      )}
      onSortEnd={useCallback(
        (sort, event) => {
          selectableStore.setSorting(false)
          onSortEnd && onSortEnd(sort, event)
        },
        [onSortStart],
      )}
    >
      {ListRow as any}
    </SortableList>
  )
}

const isRightClick = e =>
  (e.buttons === 1 && e.ctrlKey === true) || // macOS trackpad ctrl click
  (e.buttons === 2 && e.button === 2) // Regular mouse or macOS double-finger tap

const getSeparatorProps = (items: any[], item: any, index: number) => {
  if (!item || !item.group) {
    return null
  }
  if (index === 0 || item.group !== items[index - 1].group) {
    return { separator: `${item.group}` }
  }
  return null
}
