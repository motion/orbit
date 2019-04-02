import React, { useEffect, useRef } from 'react'
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
export function SelectableDynamicList(props: SelectableDynamicListProps) {
  return <DynamicList {...props} {...useSelectableListProps(props)} />
}

export type SelectableVariableListProps = SelectableListProps & VariableSizeListProps
export function SelectableVariableList(props: SelectableVariableListProps) {
  return <VariableSizeList {...props} {...useSelectableListProps(props)} />
}

export type SelectableFixedListProps = SelectableListProps & FixedSizeListProps
export function SelectableFixedList(props: SelectableFixedListProps) {
  return <FixedSizeList {...props} {...useSelectableListProps(props)} />
}
