import { SelectionStore } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect, useMemo } from 'react'
import { SortableGrid, SortableGridProps } from '../views/SortableGrid'

type SelectableGridProps<A> = SortableGridProps<A> & {
  getItem?: (item: A, { isSelected: boolean, select: Function }) => any
  selectionStore?: SelectionStore
}

export function SelectableGrid({ items, ...props }: SelectableGridProps<any>) {
  // !TODO type
  const selectionStore = props.selectionStore || useStore(SelectionStore, props)
  const moves = items.map((_, i) => i)
  const itemsKey = JSON.stringify(items.map(i => i.id))

  useEffect(
    () => {
      selectionStore.setResults([{ type: 'column' as 'column', indices: moves }])
    },
    [itemsKey],
  )

  const itemViews = useMemo(
    () => {
      return items.map((item, index) => {
        const select = () => {
          selectionStore.setActiveIndex(index)
        }
        // this is complex so we can do single updates on selection move
        return observer(function GridItem() {
          return props.getItem(item, {
            isSelected: selectionStore.activeIndex === index,
            select,
          })
        })
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
