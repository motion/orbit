import { BorderLeft, Row, SearchableTable, Text, Tree, View } from '@mcro/ui'
import faker from 'faker'
import immer from 'immer'
import React, { useState } from 'react'
import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { Title } from '../../views'
import { DateFormat } from '../../views/DateFormat'
import ReactiveCheckBox from '../../views/ReactiveCheckBox'
import VerticalSplitPane from '../../views/VerticalSplitPane'
import { AppProps } from '../AppTypes'

const channels = [...new Array(50000)].map(() => ({
  name: faker.name.firstName(),
  topic: faker.lorem.sentence(),
  members: faker.random.number(),
  created: faker.date.past(),
}))

function CustomAppTree() {
  const [treeState, setTreeState] = useState({
    '0': {
      id: '0',
      name: 'test',
      expanded: false,
      children: ['1', '2'],
    },
    '1': {
      id: '1',
      name: 'test one',
      expanded: false,
      children: [],
    },
    '2': {
      id: '2',
      name: 'test two',
      expanded: false,
      children: [],
    },
  })

  return (
    <Tree
      root="0"
      onTreeItemSelected={id => {
        console.log('select', id)
      }}
      onTreeItemExpanded={(id /* deep */) => {
        setTreeState(
          immer(treeState, next => {
            next[id].expanded = !next[id].expanded
          }),
        )
      }}
      elements={treeState}
    />
  )
}

export const CustomAppMain = memoIsEqualDeep((_props: AppProps) => {
  console.log('why is this rendering...')

  return (
    <Row flex={1}>
      <VerticalSplitPane>
        <Title>hello</Title>

        <CustomAppTree />
      </VerticalSplitPane>

      <VerticalSplitPane>
        <BorderLeft />
        <View position="relative" flex={1}>
          <SearchableTable
            virtual
            rowLineHeight={28}
            floating={false}
            columnSizes={{
              name: '25%',
              topic: '25%',
              members: '20%',
              createdAt: '15%',
              active: '15%',
            }}
            columns={{
              name: {
                value: 'Name',
                sortable: true,
                resizable: true,
              },
              topic: {
                value: 'Topic',
                sortable: true,
                resizable: true,
              },
              members: {
                value: 'Members',
                sortable: true,
                resizable: true,
              },
              createdAt: {
                value: 'Created',
                sortable: true,
                resizable: true,
              },
              active: {
                value: 'Active',
                sortable: true,
              },
            }}
            multiHighlight
            // highlightedRows={highlightedRows}
            // onRowHighlighted={setHighlightedRows}
            rows={channels.map((channel, index) => {
              const topic = channel.topic ? channel.topic : ''
              return {
                key: `${index}`,
                columns: {
                  name: {
                    sortValue: channel.name,
                    value: channel.name,
                  },
                  topic: {
                    sortValue: topic,
                    value: topic,
                  },
                  members: {
                    sortValue: channel.members,
                    value: channel.members,
                  },
                  createdAt: {
                    sortValue: channel.created,
                    value: (
                      <Text ellipse>
                        <DateFormat date={new Date(channel.created * 1000)} />
                      </Text>
                    ),
                  },
                  active: {
                    sortValue: true,
                    value: <ReactiveCheckBox isActive={() => true} />,
                  },
                },
              }
            })}
            bodyPlaceholder={
              <div style={{ margin: 'auto' }}>
                <Text size={1.2}>Loading...</Text>
              </div>
            }
          />
        </View>
      </VerticalSplitPane>
    </Row>
  )
})
