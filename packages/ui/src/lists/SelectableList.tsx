import { useReaction } from '@o/use-store'
import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { MergeContext } from '../helpers/MergeContext'
import { DynamicListControlled } from './DynamicList'
import { HandleSelection } from './ListItem'
import { SelectableProps, SelectableStore, useSelectableStore } from './SelectableStore'
import { VirtualList, VirtualListProps } from './VirtualList'

export type SelectableListProps = VirtualListProps<any> &
  SelectableProps & {
    selectableStore?: SelectableStore
  }

interface SelectContext {
  onSelectItem?: HandleSelection
  onOpenItem?: HandleSelection
}

const SelectableListContext = createContext<SelectContext>({
  onSelectItem: () => console.log('no select event for onSelectItem'),
  onOpenItem: () => console.log('no select event for onOpenItem'),
})

export function ProvideSelectableHandlers({
  children,
  ...rest
}: SelectContext & { children: any }) {
  return (
    <MergeContext Context={SelectableListContext} value={rest}>
      {children}
    </MergeContext>
  )
}

export function SelectableList({ items, ...props }: SelectableListProps) {
  const selectableStore = props.selectableStore || useSelectableStore(props)
  const selectableProps = useContext(SelectableListContext)
  const listRef = useRef<DynamicListControlled>(null)

  useEffect(() => {
    selectableStore.setListRef(listRef.current)
  }, [listRef])

  useEffect(() => {
    selectableStore.setRows(items)
  }, [items])

  useReaction(
    () => selectableStore.active,
    active => {
      // ensure('activeIndex', typeof activeIndex === 'number' && activeIndex >= 0)
      // ensure('has list', !!listRef.current)
      // ensure('is active', selectableStore.isActive)
      // ensure('used key', selectableStore.selectEvent === SelectEvent.key)
      // listRef.current.scrollToIndex(activeIndex)
      console.log('should scroll to', active)
    },
  )

  const onSelect: VirtualListProps<any>['onSelect'] = useCallback(
    (index, eventType, event) => {
      if (props.onSelect) {
        return props.onSelect(index, eventType, event)
      }
      if (selectableStore) {
        selectableStore.setRowActive(index, event)
      }
      if (selectableProps && selectableProps.onSelectItem) {
        selectableProps.onSelectItem(index, eventType, event)
      }
    },
    [selectableProps, props.onSelect],
  )

  const getItemProps: VirtualListProps<any>['getItemProps'] = useCallback(
    (item, index, listItems) => {
      return {
        ...(props.getItemProps && props.getItemProps(item, index, listItems)),
        onMouseDown: e => selectableStore.setRowActive(index, e),
        onMouseEnter: () => selectableStore.onHoverRow(index),
        selectableStore,
      }
    },
    [props.getItemProps],
  )

  return (
    <VirtualList
      items={items}
      listRef={listRef}
      onOpen={selectableProps && selectableProps.onSelectItem}
      {...props}
      // overwrite
      getItemProps={getItemProps}
      onSelect={onSelect}
    />
  )
}
