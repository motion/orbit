import { SortableContainer, SortableContainerProps } from '@o/react-sortable-hoc'
import { omit } from 'lodash'
import React, { createContext, forwardRef, RefObject, useCallback, useContext, useRef } from 'react'
import { Config } from '../helpers/configure'
import { useDefaultProps } from '../hooks/useDefaultProps'
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

export function VirtualList(rawProps: VirtualListProps<any>) {
  const defaultProps = useContext(VirtualListDefaultProps)
  const props = useDefaultProps(defaultProps, rawProps)
  const fallback = useRef<SelectableStore>(null)
  const selectableStoreRef = props.selectableStoreRef || fallback
  const dynamicListProps = omit(props, 'ItemView', 'onOpen', 'sortable', 'getItemProps', 'items')
  const { ItemView, onSelect, sortable, items, getItemProps, onOpen } = props

  const Row = useCallback(
    forwardRef<any, any>(function GetItem({ index, style }, ref) {
      const item = items[index]
      return (
        <VirtualListItem
          forwardRef={ref}
          key={Config.getItemKey(item)}
          ItemView={ItemView}
          onClick={useCallback(e => onSelect(index, e), [])}
          onDoubleClick={useCallback(e => onOpen(index, e), [])}
          disabled={!sortable}
          {...getSeparatorProps(items, item, index)}
          {...props.itemProps}
          {...getItemProps && getItemProps(item, index, items)}
          onMouseDown={useCallback(e => selectableStoreRef.current.setRowActive(index, e), [])}
          onMouseEnter={useCallback(() => selectableStoreRef.current.onHoverRow(index), [])}
          selectableStore={selectableStoreRef.current}
          {...item}
          index={index}
          realIndex={index}
          style={style}
        />
      )
    }),
    [onSelect, onOpen, getItemProps, items, selectableStoreRef.current],
  )

  return (
    <SortableList
      selectableStoreRef={selectableStoreRef}
      itemCount={props.items.length}
      itemData={props.items}
      shouldCancelStart={isRightClick}
      lockAxis="y"
      {...dynamicListProps}
    >
      {Row as any}
    </SortableList>
  )
}

export const VirtualListDefaultProps = createContext<Partial<VirtualListProps<any>>>({})

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
