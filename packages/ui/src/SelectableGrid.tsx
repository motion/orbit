import { useStore } from '@o/use-store'
import React, { useCallback } from 'react'

import { SelectableProps, SelectableStore } from './lists/SelectableStore'
import { SortableGrid, SortableGridProps } from './SortableGrid'

type SelectableGridProps<A> = SortableGridProps<A> &
  SelectableProps & {
    getItem?: (item: A, { isSelected: boolean, select: Function }) => any
    selectableStore?: SelectableStore
  }

export function SelectableGrid(props: SelectableGridProps<any>) {
  const selectableStore = props.selectableStore || useStore(SelectableStore, props)

  const itemViews = props.items.map((item, index) => {
    // this is complex so we can do single updates on selection move
    return function GridItem() {
      const store = useStore(selectableStore)
      return props.getItem(item, {
        isSelected: store.isActiveIndex(index),
        select: () => {
          selectableStore.setRowMouseDown(index)
        },
      })
    }
  })

  const getItem = useCallback(
    (_, index) => {
      const ItemView = itemViews[index]
      return <ItemView />
    },
    [itemViews],
  )

  return <SortableGrid {...props} getItem={getItem} />
}
