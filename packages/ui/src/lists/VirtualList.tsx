import { SortableContainer, SortableContainerProps } from '@o/react-sortable-hoc'
import { idFn, selectDefined } from '@o/utils'
import memoize from 'memoize-one'
import React, { forwardRef, memo, RefObject, useCallback } from 'react'

import { defaultSortPressDelay } from '../constants'
import { Config } from '../helpers/configureUI'
import { createContextualProps } from '../helpers/createContextualProps'
import { rowItemCompare } from '../helpers/rowItemCompare'
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
  forwardRef((props: any, ref) => {
    const { data, index, style } = props
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
        key={Config.getItemKey(item, index)}
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

// this memo seems to help most of the extraneous renders
export const VirtualList = memo((virtualProps: VirtualListProps) => {
  const props = useProps(virtualProps)
  const { onSortStart, onSortEnd } = props
  const selectableStore = useSelectableStore(props)

  console.log('renering virtual list.......')

  return (
    <SortableList
      selectableStore={selectableStore}
      itemCount={props.items.length}
      itemData={createItemData(props.items, selectableStore, props)}
      shouldCancelStart={isRightClick}
      lockAxis="y"
      {...props}
      pressDelay={selectDefined(props.pressDelay, defaultSortPressDelay)}
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
})

const isRightClick = e =>
  (e.buttons === 1 && e.ctrlKey === true) || // macOS trackpad ctrl click
  (e.buttons === 2 && e.button === 2) // Regular mouse or macOS double-finger tap

const getSeparatorProps = (items: any[], item: any, index: number) => {
  if (!item || !item.groupName) {
    return null
  }
  if (index === 0 || item.groupName !== items[index - 1].groupName) {
    return { separator: `${item.groupName}` }
  }
  return null
}
