import * as React from 'react'
import { view } from '@mcro/black'
import { ListItem } from './SortableListItem'

export const FirstItems = view(({ items, searchStore }) => {
  return (
    <div
      style={{
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {items.slice(0, 10).map((item, index) => (
        <ListItem
          key={item.id}
          model={item}
          realIndex={index + searchStore.quickSearchState.results.length}
          ignoreSelection
        />
      ))}
    </div>
  )
})
