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

type SelectContext = {
  onSelectItem?: HandleSelection
  onOpenItem?: HandleSelection
}

const SelectableListContext = createContext({
  onSelectItem: (_a, _b) => console.log('no select event for onSelectItem'),
  onOpenItem: (_a, _b) => console.log('no select event for onOpenItem'),
} as SelectContext)

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

export function SelectableList({ items, getItemProps, ...props }: SelectableListProps) {
  const selectableStore = props.selectableStore || useSelectableStore(props)
  const selectableProps = useContext(SelectableListContext)
  const listRef = useRef<DynamicListControlled>(null)

  useEffect(
    () => {
      selectableStore.setRows(items)
    },
    [items],
  )

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
        selectableStore.setRowActive(items[index], index, event)
      }
      if (selectableProps && selectableProps.onSelectItem) {
        selectableProps.onSelectItem(index, eventType, event)
      }
    },
    [selectableProps, props.onSelect],
  )

  return (
    <VirtualList
      items={items}
      listRef={listRef}
      onOpen={selectableProps && selectableProps.onSelectItem}
      getItemProps={getItemProps}
      {...props}
      // overwrite prop
      onSelect={onSelect}
    />
  )
}
