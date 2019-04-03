import { Table } from '@o/kit'
import { DataInspector, Layout, Pane, Paragraph, SubTitle, Title, Tree } from '@o/ui'
import faker from 'faker'
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

const rowTypes = ['error', 'debug', 'warn', 'fatal', 'verbose', 'info']
const rows = [...new Array(10000)].map((_, index) => ({
  key: `${index}`,
  category: rowTypes[index % 20],
  values: {
    name: faker.name.firstName(),
    topic: faker.lorem.sentence(),
    members: faker.random.number(),
    createdAt: new Date(faker.date.past() * 1000),
    active: false,
  },
}))

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
            console.log('select2', id)
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
      <Pane flex={3} collapsable title="Inspect" resizable>
        <Table selectable rows={rows} />
      </Pane>
      <Pane title="Sidebar">
        <Layout type="column">
          <Pane title="Elements" padded collapsable>
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
          <Pane title="Elements" flex={2} padded collapsable>
            <Title>Description</Title>
            <SubTitle>Sub title</SubTitle>
            <Paragraph>lorem ipsum dolor sit amet.</Paragraph>
          </Pane>
        </Layout>
      </Pane>
    </Layout>
  )
}
