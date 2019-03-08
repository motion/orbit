import { AppProps, Icon } from '@o/kit'
import {
  BorderLeft,
  CheckboxReactive,
  DateFormat,
  Row,
  SearchableTable,
  Text,
  Title,
  VerticalSplit,
  VerticalSplitPane,
  View,
} from '@o/ui'
import faker from 'faker'
import React from 'react'

const channels = [...new Array(10000)].map(() => ({
  name: faker.name.firstName(),
  topic: faker.lorem.sentence(),
  members: faker.random.number(),
  created: faker.date.past(),
}))

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

export function CustomAppMain(_props: AppProps) {
  const handleHighlightedRow = items => {
    console.log('items', items)
  }

  return (
    <Row flex={1}>
      <VerticalSplit>
        <VerticalSplitPane>
          <BorderLeft />
          <View position="relative" flex={1}>
            <SearchableTable
              multiHighlight
              onRowsHighlighted={handleHighlightedRow}
              defaultFilters={[
                {
                  type: 'enum' as 'enum',
                  enum: Object.keys(LOG_TYPES).map(value => ({
                    label: LOG_TYPES[value].label,
                    value,
                    color: 'red',
                  })),
                  key: 'type',
                  value: [],
                  persistent: true,
                },
              ]}
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

        <VerticalSplitPane>
          <Title bordered>Hello World</Title>
        </VerticalSplitPane>
      </VerticalSplit>
    </Row>
  )
}
