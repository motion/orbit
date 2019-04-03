import { DataInspector, Layout, Pane, Tree } from '@o/ui'
import produce from 'immer'
import React, { useState } from 'react'

const treeData = {
  0: {
    id: 0,
    name: 'Root Item',
    expanded: true,
    children: [1, 2],
  },
  1: {
    id: 1,
    name: 'test one',
    expanded: false,
    children: [3, 4],
  },
  2: {
    id: 2,
    name: 'lorem ipsum dolor',
    expanded: false,
    children: [],
  },
  3: {
    id: 3,
    name: 'sit amet',
    expanded: false,
    children: [],
  },
  4: {
    id: 4,
    name: 'test two',
    expanded: false,
    children: [],
  },
}

export function CustomAppTree() {
  const [treeState, setTreeState] = useState(treeData)
  const [selected, setSelected] = useState(0)

  return (
    <Layout type="row">
      <Pane title="Select Items" resizable>
        <Tree
          root={0}
          selected={selected}
          onTreeItemSelected={id => {
            console.log('select', id)
            setSelected(id)
          }}
          onTreeItemExpanded={id => {
            setTreeState(
              produce(treeState, next => {
                next[id].expanded = !next[id].expanded
              }),
            )
          }}
          elements={treeState}
        />
      </Pane>
      <Pane flex={2} collapsable title="Inspect" padded>
        <DataInspector
          data={{
            test: 'this',
            thing: 0,
            is: 'hi',
            who: 'are',
            you: new Date(),
            color: 'yellow',
            another: {
              one: 'color',
              two: 'green',
            },
          }}
        />
      </Pane>
    </Layout>
  )
}
