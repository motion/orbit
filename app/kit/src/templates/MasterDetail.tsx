import { Layout, Loading, Pane } from '@o/ui'
import { selectDefined } from '@o/utils'
import React, { useState } from 'react'
import { List } from '../views/List'
import { OrbitListItemProps } from '../views/ListItem'

export type MasterDetailProps = {
  items: OrbitListItemProps[]
  children: (selected: OrbitListItemProps) => React.ReactNode
  placeholder?: React.ReactNode
}

export function MasterDetail(props: MasterDetailProps) {
  const placeholder = selectDefined(props.placeholder, <Loading />)
  const [selected, setSelected] = useState(null)
  return (
    <Layout type="row">
      <Pane resizable>
        <List
          items={props.items}
          onSelect={rows => {
            console.log('rows', rows)
            if (rows.length) {
              setSelected(rows[0])
            }
          }}
          itemProps={{ iconBefore: true }}
        />
      </Pane>
      <Pane flex={2}>{selected === null ? placeholder : props.children(selected)}</Pane>
    </Layout>
  )
}
