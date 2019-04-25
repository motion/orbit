import { SortableContainer, SortableContainerProps } from '@o/react-sortable-hoc'
import { omit } from 'lodash'
import React, { forwardRef, RefObject, useCallback } from 'react'

import { Config } from '../helpers/configure'
import { createContextualProps } from '../helpers/createContextualProps'
import { GenericComponent, Omit } from '../types'
import { DynamicListControlled, DynamicListProps } from './DynamicList'
import { ListItemProps } from './ListItem'
import { HandleSelection } from './ListItemSimple'
import { SelectableDynamicList } from './SelectableList'
import { SelectableProps, useSelectableStore } from './SelectableStore'
import { VirtualListItem } from './VirtualListItem'

export type VirtualListProps<A> = SelectableProps &
  SortableContainerProps &
  Omit<DynamicListProps, 'children' | 'itemCount' | 'itemData'> & {
    onSelect?: HandleSelection
    onOpen?: HandleSelection
    itemProps?: Partial<A>
    ItemView?: GenericComponent<A>
    sortable?: boolean
    listRef?: RefObject<DynamicListControlled>

    /** Filter by search string */
    items: A[]

    /** Dynamically add extra props to each item */
    getItemProps?: (item: A, index: number, items: A[]) => ListItemProps | null | false
  }

const SortableList = SortableContainer(SelectableDynamicList, { withRef: true })

const { useProps } = createContextualProps<Partial<VirtualListProps<any>>>()

export function VirtualList(virtualProps: VirtualListProps<any>) {
  const { pressDelay = 150, ...props } = useProps(virtualProps)
  const selectableStore = useSelectableStore(props)
  const dynamicListProps = omit(props, 'ItemView', 'onOpen', 'sortable', 'getItemProps', 'items')
  const { ItemView, onSelect, sortable, items, getItemProps, onOpen } = props

  const Row = useCallback(
    forwardRef<any, any>(function GetItem({ index, style }, ref) {
      const item = items[index]
      let mouseDownTm = null
      const itemProps: ListItemProps = {
        ...props.itemProps,
        ...(getItemProps && getItemProps(item, index, items)),
      }
      let finishSelect = false
      return (
        <VirtualListItem
          forwardRef={ref}
          key={Config.getItemKey(item)}
          ItemView={ItemView}
          onClick={useCallback(e => onSelect(index, e), [])}
          onDoubleClick={useCallback(e => onOpen(index, e), [])}
          disabled={!sortable}
          {...getSeparatorProps(items, item, index)}
          {...itemProps}
          onMouseUp={useCallback(e => {
            clearTimeout(mouseDownTm)
            if (finishSelect) {
              finishSelect = false
              selectableStore.setRowActive(index, e)
            }
            if (itemProps.onMouseUp) {
              itemProps.onMouseUp(e)
            }
          }, [])}
          onMouseDown={useCallback(e => {
            clearTimeout(mouseDownTm)
            // add delay when sortable
            const setRowActive = () => {
              selectableStore.setRowMouseDown(index, e)
              finishSelect = false
            }
            if (props.sortable) {
              finishSelect = true
              mouseDownTm = setTimeout(setRowActive, pressDelay)
            } else {
              setRowActive()
            }
            if (itemProps.onMouseDown) {
              itemProps.onMouseDown(e)
            }
          }, [])}
          onMouseEnter={useCallback(e => {
            selectableStore.onHoverRow(index)
            if (itemProps.onMouseEnter) {
              itemProps.onMouseEnter(e)
            }
          }, [])}
          selectableStore={selectableStore}
          {...item}
          index={index}
          realIndex={index}
          style={style}
        />
      )
    }),
    [props.sortable, pressDelay, onSelect, onOpen, getItemProps, items, selectableStore],
  )

  return (
    <SortableList
      selectableStore={selectableStore}
      itemCount={props.items.length}
      itemData={props.items}
      shouldCancelStart={isRightClick}
      lockAxis="y"
      pressDelay={pressDelay}
      {...dynamicListProps}
    >
      {Row as any}
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
