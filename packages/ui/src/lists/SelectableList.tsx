import { useReaction } from '@o/use-store'
import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { Config } from '../helpers/configure'
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
    () => [...selectableStore.active],
    active => {
      if (active.length <= 1) {
        // TODO this is hacky, we need:
        //   1. make a better getitemKey without index
        //   2. make a methond on selectableStore.getItemIndex()
        //   2. onSelect/onSelectItem should take multiple
        const key = active[0]
        const index = items.findIndex(x => x && Config.getItemKey(x, -1) === key)

        // scroll to
        if (listRef.current) {
          listRef.current.scrollToIndex(index)
        }

        // callbacks
        if (props.onSelect) {
          props.onSelect(index, event)
        } else {
          if (selectableProps && selectableProps.onSelectItem) {
            selectableProps.onSelectItem(index, event)
          }
        }
      }
    },
    [items],
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
    />
  )
}
