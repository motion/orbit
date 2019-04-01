import { useReaction } from '@o/use-store'
import React, { useCallback, useEffect, useRef } from 'react'
import { Config } from '../helpers/configure'
import { useGet } from '../hooks/useGet'
import { DynamicListControlled } from './DynamicList'
import { SelectableProps, useSelectableStore } from './SelectableStore'
import { VirtualList, VirtualListProps } from './VirtualList'

export type SelectableListProps = VirtualListProps<any> & SelectableProps

export function SelectableList(props: SelectableListProps) {
  const selectableStore = props.selectableStore || useSelectableStore(props)
  const listRef = useRef<DynamicListControlled>(null)
  const getItems = useGet(props.items)

  useEffect(() => {
    selectableStore.setListRef(listRef.current)
  }, [listRef])

  useEffect(() => {
    selectableStore.setRows(props.items)
  }, [props.items])

  useReaction(
    () => [...selectableStore.active],
    active => {
      const items = getItems()
      if (active.length <= 1) {
        // TODO this is hacky, we need:
        //   1. make a better getitemKey without index
        //   2. make a methond on selectableStore.getItemIndex()
        //   2. onSelect/onSelectItem should take multiple
        const key = active[0]
        const index = items.findIndex((x, i) => x && Config.getItemKey(x, i) === key)

        // scroll to
        if (listRef.current) {
          listRef.current.scrollToIndex(index)
        }

        // callbacks
        if (props.onSelect) {
          props.onSelect(index, event)
        }
      }
    },
  )

  return (
    <VirtualList
      listRef={listRef}
      {...props}
      // overwrite
      getItemProps={useCallback(
        (item, index, listItems) => ({
          ...(props.getItemProps && props.getItemProps(item, index, listItems)),
          onMouseDown: e => selectableStore.setRowActive(index, e),
          onMouseEnter: () => selectableStore.onHoverRow(index),
          selectableStore,
        }),
        [props.getItemProps],
      )}
    />
  )
}
