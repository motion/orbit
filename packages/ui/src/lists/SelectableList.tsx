import { FixedSizeList, FixedSizeListProps, VariableSizeList, VariableSizeListProps } from '@o/react-window'
import React, { forwardRef, useEffect, useRef } from 'react'

import { DynamicList, DynamicListControlled, DynamicListProps } from './DynamicList'
import { SelectableProps } from './SelectableStore'

type SelectableListProps = SelectableProps & { listRef?: any }

export function useSelectableProps(props: SelectableListProps, extraRef: any) {
  const selectableStore = props.selectableStore
  const internalRef = useRef<DynamicListControlled>(null)
  const listRef = props.listRef || internalRef

  useEffect(() => {
    selectableStore && selectableStore.setListRef(listRef.current)
    extraRef && extraRef(listRef.current)
  }, [listRef, selectableStore])

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
