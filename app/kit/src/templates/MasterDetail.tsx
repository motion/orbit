import { Layout, Pane } from "@o/ui";
import React, { useState } from "react";
import { List } from "../views/List";
import { OrbitListItemProps } from "../views/ListItem";

export type MasterDetailProps = {
  items: OrbitListItemProps[]
  children: (selected: OrbitListItemProps) => React.ReactNode
}

export function MasterDetail(props: MasterDetailProps) {
  const [selected, setSelected] = useState(null)
  return (
    <Layout style="row">
      <Pane>
        <List
          dynamicHeight
          maxHeight={1000}
          items={props.items}
          onSelect={index => setSelected(props.items[index])}
          itemProps={{ iconBefore: true }}
        />
      </Pane>
      <Pane flex={1}>{props.children(selected)}</Pane>
    </Layout>
  )
}
