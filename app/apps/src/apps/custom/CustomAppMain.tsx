import { AppProps, Icon } from '@mcro/kit'
import {
  BorderLeft,
  Button,
  CheckboxReactive,
  DateFormat,
  Row,
  SearchableTable,
  Section,
  Text,
  Title,
  Tree,
  VerticalSplit,
  VerticalSplitPane,
  View,
} from '@mcro/ui'
import faker from 'faker'
import immer from 'immer'
import React, { useState } from 'react'

const channels = [...new Array(10000)].map(() => ({
  name: faker.name.firstName(),
  topic: faker.lorem.sentence(),
  members: faker.random.number(),
  created: faker.date.past(),
}))

const treeData = {
  '0': {
    id: '0',
    name: 'Root Item',
    expanded: true,
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
}

const LOG_TYPES = {
  verbose: {
    label: 'Verbose',
    color: 'purple',
  },
  debug: {
    label: 'Debug',
    color: 'grey',
  },
  info: {
    label: 'Info',
    icon: <Icon name="info-circle" color={'cyan'} />,
    color: 'cyan',
  },
  warn: {
    label: 'Warn',
    style: {
      backgroundColor: 'yellowTint',
      color: 'yellow',
      fontWeight: 500,
    },
    icon: <Icon name="caution-triangle" color={'yellow'} />,
    color: 'yellow',
  },
  error: {
    label: 'Error',
    style: {
      backgroundColor: 'redTint',
      color: 'red',
      fontWeight: 500,
    },
    icon: <Icon name="caution-octagon" color={'red'} />,
    color: 'red',
  },
  fatal: {
    label: 'Fatal',
    style: {
      backgroundColor: 'redTint',
      color: 'red',
      fontWeight: 700,
    },
    icon: <Icon name="stop" color={'red'} />,
    color: 'red',
  },
}

const DEFAULT_FILTERS = [
  {
    type: 'enum',
    enum: Object.keys(LOG_TYPES).map(value => ({
      label: LOG_TYPES[value].label,
      value,
    })),
    key: 'type',
    value: [],
    persistent: true,
  },
]

export function CustomAppMain(_props: AppProps) {
  const [treeState, setTreeState] = useState(treeData)

  return (
    <Row flex={1}>
      <VerticalSplit>
        <VerticalSplitPane>
          <Title bordered>Hello World Edit</Title>

          <Section>
            <Button size={2} icon="sun">
              this is my button
            </Button>
          </Section>

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
        </VerticalSplitPane>

        <VerticalSplitPane>
          <BorderLeft />
          <View position="relative" flex={1}>
            <SearchableTable
              virtual
              rowLineHeight={28}
              floating={false}
              defaultFilters={DEFAULT_FILTERS}
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
                      value: <CheckboxReactive isActive={() => true} />,
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
      </VerticalSplit>
    </Row>
  )
}
