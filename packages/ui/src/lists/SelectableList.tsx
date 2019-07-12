import { FixedSizeList, FixedSizeListProps, VariableSizeList, VariableSizeListProps } from '@o/react-window'
import React, { forwardRef, useEffect, useRef } from 'react'

import { composeRefs } from '../helpers/composeRefs'
import { DynamicList, DynamicListControlled, DynamicListProps } from './DynamicList'
import { SelectableProps, useCreateSelectableStore } from './SelectableStore'

type SelectableListProps = SelectableProps & { listRef?: any }

export function useSelectableProps(props: SelectableListProps, extraRef: any) {
  const selectableStore = useCreateSelectableStore(props)
  const internalRef = useRef<DynamicListControlled>(null)

  useEffect(() => {
    selectableStore && selectableStore.setListRef(internalRef.current)
  }, [internalRef, selectableStore])

  return {
    ref: composeRefs(props.listRef, internalRef, extraRef),
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
