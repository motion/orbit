import { AppType } from '@mcro/models'
import { SearchableTable, Text } from '@mcro/ui'
import faker from 'faker'
import React from 'react'
import { DateFormat } from '../../views/DateFormat'
import ReactiveCheckBox from '../../views/ReactiveCheckBox'
import { Section } from '../../views/Section'
import { AppProps } from '../AppProps'

const channels = [...new Array(50000)].map(() => ({
  name: faker.name.firstName(),
  topic: faker.lorem.sentence(),
  members: faker.random.number(),
  created: faker.date.past(),
}))

export function CustomAppMain(_props: AppProps<AppType.custom>) {
  return (
    <Section flex={1} sizePadding={2}>
      <Text>hi</Text>

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
    </Section>
  )
}
