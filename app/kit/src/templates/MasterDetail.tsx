import { Layout, Loading, Pane } from '@o/ui'
import React, { useState } from 'react'
import { List } from '../views/List'
import { OrbitListItemProps } from '../views/ListItem'

export type MasterDetailProps = {
  items: OrbitListItemProps[]
  children: (selected: OrbitListItemProps) => React.ReactNode
  placeholder?: React.ReactNode
}

export function MasterDetail(props: MasterDetailProps) {
  const placeholder = props.placeholder || <Loading />
  const [selected, setSelected] = useState(null)
  return (
    <Layout type="row">
      <Pane resizable>
        <List
          dynamicHeight
          maxHeight={1000}
          items={props.items}
          onSelect={index => setSelected(props.items[index])}
          itemProps={{ iconBefore: true }}
        />
      </Pane>
      <Pane flex={2}>{!selected ? placeholder : props.children(selected)}</Pane>
    </Layout>
  )
}
