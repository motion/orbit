import { App, AppProps, createApp } from '@o/kit'
import { Tree } from '@o/ui'
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

function TreeApp(_props: AppProps) {
  const [treeState, setTreeState] = useState(treeData)

  return (
    <App>
      <Tree
        root={0}
        onTreeItemSelected={id => {
          console.log('select', id)
        }}
        onTreeItemExpanded={(id /* deep */) => {
          setTreeState(
            produce(treeState, next => {
              next[id].expanded = !next[id].expanded
            }),
          )
        }}
        elements={treeState}
      />
    </App>
  )
}

export default createApp({
  id: 'custom-tree',
  name: 'Tree App Demo',
  icon: '',
  app: TreeApp,
})
