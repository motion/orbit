import { Layout, Pane } from '@o/ui'
import React, { useCallback, useState } from 'react'
import { ListProps, SearchableList } from '../views/List'
import { OrbitListItemProps } from '../views/ListItem'

export type MasterDetailProps = ListProps & {
  children: React.ReactNode | ((selected: OrbitListItemProps) => React.ReactNode)
  placeholder?: React.ReactNode
}

export function MasterDetail({ children, placeholder, onSelect, ...listProps }: MasterDetailProps) {
  const [selected, setSelected] = useState(null)
  const contents =
    typeof children === 'function'
      ? selected === null
        ? placeholder || null
        : children(selected)
      : children

  return (
    <Layout type="row">
      <Pane resizable>
        <SearchableList
          selectable
          onSelect={useCallback(
            rows => {
              if (onSelect) {
                onSelect(rows[0])
                return
              }
              if (rows.length) {
                setSelected(rows[0])
              }
            },
            [onSelect],
          )}
          {...listProps}
          itemProps={{ iconBefore: true, ...listProps.itemProps }}
        />
      </Pane>
      <Pane flex={2}>{contents}</Pane>
    </Layout>
  )
}
