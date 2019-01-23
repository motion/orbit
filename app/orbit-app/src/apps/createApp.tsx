import React from 'react'
import SelectableList from '../views/Lists/SelectableList'

export const createApp = {
  index: () => {
    return (
      <SelectableList
        items={[
          {
            title: 'Search',
            icon: 'orbitSearch',
            subtitle: 'Custom search pane',
          },
          {
            title: 'List',
            icon: 'orbitList',
            subtitle: 'Custom list pane',
          },
        ]}
      />
    )
  },
  main: () => {
    return null
  },
}
