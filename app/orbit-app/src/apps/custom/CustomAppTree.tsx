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
    children: [],
  },
  2: {
    id: 2,
    name: 'test two',
    expanded: false,
    children: [],
  },
}

export function CustomAppTree() {
  const [treeState, setTreeState] = useState(treeData)

  return (
    <Layout type="row">
      <Pane title="Select Items" resizable>
        <Tree
          root={0}
          onTreeItemSelected={id => {
            console.log('select', id)
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
