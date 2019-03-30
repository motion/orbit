import { useStore } from '@o/use-store'
import React, { useCallback, useEffect, useMemo } from 'react'
import { SelectionStore } from './lists/SelectionStore'
import { SortableGrid, SortableGridProps } from './SortableGrid'

type SelectableGridProps<A> = SortableGridProps<A> & {
  getItem?: (item: A, { isSelected: boolean, select: Function }) => any
  selectionStore?: SelectionStore
}

export function SelectableGrid({ items, ...props }: SelectableGridProps<any>) {
  const selectionStore = props.selectionStore || useStore(SelectionStore, props as any)
  const itemsKey = JSON.stringify(items.map(i => i.id))

  useEffect(
    () => {
      selectionStore.setItems([
        { type: 'column' as 'column', items: items.map(({ id }, index) => ({ id, index })) },
      ])
    },
    [itemsKey],
  )

  const itemViews = useMemo(
    () => {
      return items.map((item, index) => {
        const select = () => {
          selectionStore.setIndex(index)
        }
        // this is complex so we can do single updates on selection move
        return function GridItem() {
          const store = useStore(selectionStore)
          return props.getItem(item, {
            isSelected: store.activeIndex === index,
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
