import { GET_STORE, useReaction } from '@o/use-store'
import { omit } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { Config } from '../helpers/configure'
import { useGet } from '../hooks/useGet'
import { DynamicList, DynamicListControlled, DynamicListProps } from './DynamicList'
import { SelectableProps, useSelectableStore } from './SelectableStore'

export type SelectableDynamicListProps = DynamicListProps & SelectableProps

export function SelectableDynamicList(props: SelectableDynamicListProps) {
  const dynamicListProps = omit(props)

  const selectableStore = props.selectableStore || useSelectableStore(props)
  if (props.selectableStoreRef) {
    props.selectableStoreRef.current = selectableStore[GET_STORE]
  }
  const innerListRef = useRef<DynamicListControlled>(null)
  const listRef = props.listRef || innerListRef
  const getItems = useGet(props.itemData)

  useEffect(() => {
    selectableStore.setListRef(listRef.current)
  }, [listRef])

  useEffect(() => {
    selectableStore.setRows(props.itemData)
  }, [props.itemData])

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
        if (props.onSelectIndices) {
          props.onSelectIndices(index)
        }
      }
    },
    {
      deferFirstRun: true,
    },
  )

  return <DynamicList {...dynamicListProps} listRef={listRef} />
}
