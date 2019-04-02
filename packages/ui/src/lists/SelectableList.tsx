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

export function useSelectableListProps(props: SelectableListProps) {
  const selectableStore = props.selectableStore || useSelectableStore(props)
  const internalRef = useRef<DynamicListControlled>(null)
  const listRef = props.listRef || internalRef

  useEffect(() => {
    selectableStore.setListRef(listRef.current)
  }, [listRef])

  useEffect(() => {
    selectableStore.setRows(props.itemData)
  }, [props.itemData])

  return {
    listRef,
  }
}

export type SelectableDynamicListProps = SelectableListProps & DynamicListProps
export const SelectableDynamicList = forwardRef((props: SelectableDynamicListProps, ref) => {
  return <DynamicList ref={ref} {...props} {...useSelectableListProps(props)} />
})

export type SelectableVariableListProps = SelectableListProps & VariableSizeListProps
export const SelectableVariableList = forwardRef((props: SelectableVariableListProps, ref) => {
  return <VariableSizeList ref={ref as any} {...props} {...useSelectableListProps(props)} />
})

export type SelectableFixedListProps = SelectableListProps & FixedSizeListProps
export const SelectableFixedList = forwardRef((props: SelectableFixedListProps, ref) => {
  return <FixedSizeList ref={ref as any} {...props} {...useSelectableListProps(props)} />
})
