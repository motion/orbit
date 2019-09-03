import { Col } from 'gloss'
import { Tree } from '@o/ui'
import produce from 'immer'
import React, { useState } from 'react'

export let Simple = () => {
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

  const [treeState, setTreeState] = useState(treeData)
  const [selected, setSelected] = useState(0)

  return (
    <Col height={100}>
      <Tree
        root={0}
        selected={selected}
        onTreeItemSelected={id => {
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
    </Col>
  )
}
