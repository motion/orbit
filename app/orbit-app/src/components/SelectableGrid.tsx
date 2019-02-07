import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo } from 'react'
import { SelectionStore } from '../stores/SelectionStore'
import { SortableGrid, SortableGridProps } from '../views/SortableGrid'

type SelectableGridProps<A> = SortableGridProps<A> & {
  getItem?: (item: A, { isSelected: boolean, select: Function }) => any
  selectionStore?: SelectionStore
}

export function SelectableGrid({ items, getItem, ...props }: SelectableGridProps<any>) {
  const selectionStore = props.selectionStore || useStore(SelectionStore)
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
        return observer(() => {
          return getItem(item, {
            isSelected: selectionStore.activeIndex === index,
            select,
          })
        })
      })
    },
    [itemsKey],
  )

  return (
    <SortableGrid
      items={items}
      getItem={(_, index) => {
        const ItemView = itemViews[index]
        return <ItemView />
      }}
      {...props}
    />
  )
}
