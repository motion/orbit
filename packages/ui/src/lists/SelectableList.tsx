import React, { forwardRef, useEffect, useRef } from 'react'
import {
  FixedSizeList,
  FixedSizeListProps,
  ListProps,
  VariableSizeList,
  VariableSizeListProps,
} from 'react-window'
import { DynamicList, DynamicListControlled, DynamicListProps } from './DynamicList'
import { SelectableProps, useSelectableStore } from './SelectableStore'

export type SelectableListProps = SelectableProps &
  Partial<ListProps> & {
    listRef?: any
  }

export function useSelectableProps(props: SelectableListProps, ref) {
  const selectableStore = props.selectableStore || useSelectableStore(props)
  const internalRef = useRef<DynamicListControlled>(null)
  const listRef = props.listRef || ref || internalRef

  console.log('rendering this')

  useEffect(() => {
    selectableStore.setListRef(listRef.current)
  }, [listRef])

  useEffect(() => {
    selectableStore.setRows(props.itemData)
  }, [props.itemData])

  return {
    ref: listRef,
  }
}

export type SelectableDynamicListProps = SelectableListProps & DynamicListProps
export const SelectableDynamicList = forwardRef((props: SelectableDynamicListProps, ref) => {
  return <DynamicList {...props} {...useSelectableProps(props, ref)} />
})

export type SelectableVariableListProps = SelectableListProps & VariableSizeListProps
export const SelectableVariableList = forwardRef((props: SelectableVariableListProps, ref) => {
  return <VariableSizeList {...props} {...useSelectableProps(props, ref)} />
})

export type SelectableFixedListProps = SelectableListProps & FixedSizeListProps
export const SelectableFixedList = forwardRef((props: SelectableFixedListProps, ref) => {
  return <FixedSizeList {...props} {...useSelectableProps(props, ref)} />
})
