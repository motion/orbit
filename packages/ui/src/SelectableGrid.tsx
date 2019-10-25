import { useStore } from '@o/use-store'
import React, { useCallback } from 'react'

import { SelectableProps, SelectableStore, useCreateSelectableStore } from './lists/SelectableStore'
import { SortableGrid, SortableGridProps } from './SortableGrid'

type SelectableGridProps<A = any> = SortableGridProps<A> &
  SelectableProps & {
    getItem?: (item: A, { isSelected: boolean, select: Function }) => any
    selectableStore?: SelectableStore
  }

export function SelectableGrid(props: SelectableGridProps) {
  const store = useCreateSelectableStore(props)
  const getItem = useCallback(
    (_, index) => {
      return (
        <SelectableGridItem
          getItem={props.getItem}
          selectableStore={store}
          index={index}
          item={props.items[index]}
        />
      )
    },
    [props.items],
  )
  return <SortableGrid {...props} getItem={getItem} />
}

type SelectableGridItemProps = Pick<SelectableGridProps, 'getItem' | 'selectableStore'> & {
  index: number
  item: any
}

/**
 * Reactive view to selection
 */
function SelectableGridItem(props: SelectableGridItemProps) {
  const store = useStore(props.selectableStore)
  const isSelected = store.isActiveIndex(props.index)
  const select = useCallback(() => {
    store.setRowMouseDown(props.index)
  }, [])
  return props.getItem(props.item, {
    isSelected,
    select,
  })
}

SelectableGrid.defaultProps = {
  selectable: true,
  gridGap: 16,
  itemMinWidth: 150,
  itemMaxWidth: 250,
}
