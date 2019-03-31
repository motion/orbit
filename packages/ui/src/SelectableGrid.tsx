import { useStore } from '@o/use-store'
import React, { useCallback, useEffect, useMemo } from 'react'
import { SelectableStore } from './lists/SelectableStore'
import { SortableGrid, SortableGridProps } from './SortableGrid'

type SelectableGridProps<A> = SortableGridProps<A> & {
  getItem?: (item: A, { isSelected: boolean, select: Function }) => any
  selectableStore?: SelectableStore
}

export function SelectableGrid({ items, ...props }: SelectableGridProps<any>) {
  const selectableStore = props.selectableStore || useStore(SelectableStore, props as any)
  const itemsKey = JSON.stringify(items.map(i => i.id))

  useEffect(
    () => {
      selectableStore.setRows(items)
    },
    [itemsKey],
  )

  const itemViews = useMemo(
    () => {
      return items.map((item, index) => {
        const select = () => {
          selectableStore.setRowActive(index)
        }
        // this is complex so we can do single updates on selection move
        return function GridItem() {
          const store = useStore(selectableStore)
          return props.getItem(item, {
            isSelected: store.isActiveIndex(index),
            select,
          })
        }
      })
    },
    [itemsKey],
  )

  const getItem = useCallback(
    (_, index) => {
      const ItemView = itemViews[index]
      return <ItemView />
    },
    [itemViews],
  )

  return <SortableGrid items={items} {...props} getItem={getItem} />
}
