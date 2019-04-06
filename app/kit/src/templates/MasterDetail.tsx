import { Layout, Pane } from '@o/ui'
import React, { useState } from 'react'
import { ListProps, SearchableList } from '../views/List'
import { OrbitListItemProps } from '../views/ListItem'

export type MasterDetailProps = ListProps & {
  children: (selected: OrbitListItemProps) => React.ReactNode
  placeholder?: React.ReactNode
}

export function MasterDetail({ children, placeholder, ...listProps }: MasterDetailProps) {
  const [selected, setSelected] = useState(null)
  return (
    <Layout type="row">
      <Pane resizable>
        <SearchableList
          selectable
          onSelect={rows => {
            if (rows.length) {
              setSelected(rows[0])
            }
          }}
          {...listProps}
          itemProps={{ iconBefore: true, ...listProps.itemProps }}
        />
      </Pane>
      <Pane flex={2}>{selected === null ? placeholder || null : children(selected)}</Pane>
    </Layout>
  )
}
