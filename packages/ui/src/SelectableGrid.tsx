import { useStore } from '@o/use-store'
import React, { useCallback, useMemo } from 'react'

import { SelectableProps, SelectableStore, useSelectableStore } from './lists/SelectableStore'
import { SortableGrid, SortableGridProps } from './SortableGrid'

type SelectableGridProps<A> = SortableGridProps<A> &
  SelectableProps & {
    getItem?: (item: A, { isSelected: boolean, select: Function }) => any
    selectableStore?: SelectableStore
  }

export function SelectableGrid(props: SelectableGridProps<any>) {
  const store = useSelectableStore(props)

  const itemViews = useMemo(() => {
    return props.items.map((item, index) => {
      // this is complex so we can do single updates on selection move
      return function GridItem() {
        const x = useStore(store)
        const isSelected = x.isActiveIndex(index)
        return props.getItem(item, {
          isSelected,
          select: () => {
            x.setRowMouseDown(index)
          },
        })
      }
    })
  }, [props.items])

  const getItem = useCallback(
    (_, index) => {
      const ItemView = itemViews[index]
      return <ItemView />
    },
    [itemViews],
  )

  return <SortableGrid {...props} getItem={getItem} />
}

SelectableGrid.defaultProps = {
  selectable: true,
  gridGap: 20,
  minWidth: 150,
  maxWidth: 250,
}
