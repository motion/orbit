import { Layout, Pane } from '@o/ui'
import React, { useCallback, useMemo, useState } from 'react'
import { ListProps, SearchableList } from '../views/List'
import { OrbitListItemProps } from '../views/ListItem'

export type MasterDetailProps = ListProps & {
  children: React.ReactNode | ((selected: OrbitListItemProps) => React.ReactNode)
  placeholder?: React.ReactNode
}

export function MasterDetail({ children, placeholder, ...listProps }: MasterDetailProps) {
  const [selected, setSelected] = useState(null)
  const contents =
    typeof children === 'function'
      ? selected === null
        ? placeholder || null
        : children(selected)
      : children

  const onSelect = useCallback(
    rows => {
      if (listProps.onSelect) {
        listProps.onSelect(rows[0])
        return
      }
      if (rows.length) {
        setSelected(rows[0])
      }
    },
    [listProps.onSelect],
  )

  const itemProps = useMemo(() => ({ iconBefore: true, ...listProps.itemProps }), [
    listProps.itemProps,
  ])

  return (
    <Layout type="row">
      <Pane resizable>
        <SearchableList selectable {...listProps} onSelect={onSelect} itemProps={itemProps} />
      </Pane>
      <Pane flex={2}>{contents}</Pane>
    </Layout>
  )
}
