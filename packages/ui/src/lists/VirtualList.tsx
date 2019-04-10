import { SortableContainer, SortableContainerProps } from '@o/react-sortable-hoc'
import { omit } from 'lodash'
import React, { forwardRef, RefObject, useCallback, useRef } from 'react'
import { Config } from '../helpers/configure'
import { createContextualProps } from '../helpers/createContextualProps'
import { GenericComponent, Omit } from '../types'
import { DynamicListControlled, DynamicListProps } from './DynamicList'
import { HandleSelection } from './ListItem'
import { SelectableDynamicList } from './SelectableList'
import { SelectableProps, SelectableStore } from './SelectableStore'
import { VirtualListItem, VirtualListItemProps } from './VirtualListItem'

export type VirtualListProps<A> = SelectableProps &
  SortableContainerProps &
  Omit<DynamicListProps, 'children' | 'itemCount' | 'itemData'> & {
    onSelect?: HandleSelection
    onOpen?: HandleSelection
    itemProps?: Partial<VirtualListItemProps<any>>
    ItemView?: GenericComponent<VirtualListItemProps<any>>
    sortable?: boolean
    listRef?: RefObject<DynamicListControlled>
    items: A[]
    getItemProps?: (item: A, index: number, items: A[]) => Record<string, any> | null | false
  }

const SortableList = SortableContainer(SelectableDynamicList, { withRef: true })

const { useProps } = createContextualProps<Partial<VirtualListProps<any>>>()

export function VirtualList(virtualProps: VirtualListProps<any>) {
  const { pressDelay = 150, ...props } = useProps(virtualProps)
  const fallback = useRef<SelectableStore>(null)
  const selectableStoreRef = props.selectableStoreRef || fallback
  const dynamicListProps = omit(props, 'ItemView', 'onOpen', 'sortable', 'getItemProps', 'items')
  const { ItemView, onSelect, sortable, items, getItemProps, onOpen } = props

  const Row = useCallback(
    forwardRef<any, any>(function GetItem({ index, style }, ref) {
      const item = items[index]
      let mouseDownTm = null
      const itemProps = {
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
              selectableStoreRef.current.setRowActive(index, e)
            }
            if (itemProps.onMouseUp) {
              itemProps.onMouseUp(e)
            }
          }, [])}
          onMouseDown={useCallback(e => {
            clearTimeout(mouseDownTm)
            // add delay when sortable
            const setRowActive = () => {
              selectableStoreRef.current.setRowMouseDown(index, e)
              finishSelect = false
            }
            if (props.sortable) {
              finishSelect = true
              mouseDownTm = setTimeout(setRowActive, pressDelay)
            } else {
              setRowActive()
            }
          }, [])}
          onMouseEnter={useCallback(() => selectableStoreRef.current.onHoverRow(index), [])}
          selectableStore={selectableStoreRef.current}
          {...item}
          index={index}
          realIndex={index}
          style={style}
        />
      )
    }),
    [props.sortable, pressDelay, onSelect, onOpen, getItemProps, items, selectableStoreRef.current],
  )

  return (
    <SortableList
      selectableStoreRef={selectableStoreRef}
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
