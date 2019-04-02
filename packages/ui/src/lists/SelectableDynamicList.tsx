import { omit } from 'lodash'
import React, { forwardRef, useEffect, useRef } from 'react'
import { DynamicList, DynamicListControlled, DynamicListProps } from './DynamicList'
import { SelectableProps, useSelectableStore } from './SelectableStore'

export type SelectableDynamicListProps = DynamicListProps & SelectableProps

export const SelectableDynamicList = forwardRef(function SelectableDynamicList(
  props: SelectableDynamicListProps,
  ref,
) {
  const dynamicListProps = omit(props)
  const selectableStore = props.selectableStore || useSelectableStore(props)
  const innerListRef = useRef<DynamicListControlled>(null)
  const listRef = props.listRef || innerListRef

  useEffect(() => {
    selectableStore.setListRef(listRef.current)
  }, [listRef])

  useEffect(() => {
    selectableStore.setRows(props.itemData)
  }, [props.itemData])

  return <DynamicList ref={ref} {...dynamicListProps} listRef={listRef} />
})
