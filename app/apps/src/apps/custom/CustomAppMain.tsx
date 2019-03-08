import { AppProps, Table } from '@o/kit'
import { createEnumFilter, Title, VerticalSplit, VerticalSplitPane } from '@o/ui'
import faker from 'faker'
import React, { useState } from 'react'

const rowTypes = ['error', 'debug', 'warn', 'fatal', 'verbose', 'info']

const rows = [...new Array(10000)].map((_, index) => ({
  key: `${index}`,
  type: Object.keys(rowTypes)[index % 3],
  values: {
    name: faker.name.firstName(),
    topic: faker.lorem.sentence(),
    members: faker.random.number(),
    createdAt: new Date(faker.date.past() * 1000),
    active: false,
  },
}))

export function CustomAppMain(_props: AppProps) {
  const [highlighted, setHighlighted] = useState([])

  return (
    <VerticalSplit>
      <VerticalSplitPane>
        <Table
          multiHighlight
          onRowsHighlighted={setHighlighted}
          rows={rows}
          defaultFilters={[createEnumFilter(rowTypes)]}
          columns={{
            name: {
              value: 'Name',
              flex: 2,
            },
            topic: {
              value: 'Topic',
              flex: 2,
            },
            members: {
              value: 'Members',
              type: 'number',
            },
            createdAt: {
              value: 'Created',
              type: 'date',
            },
            active: {
              value: 'Active',
              type: 'boolean',
            },
          }}
        />
      </VerticalSplitPane>

      <VerticalSplitPane>
        <Title bordered>Hello World</Title>
        <Form fields={highlighted} />
      </VerticalSplitPane>
    </VerticalSplit>
  )
}

function Form(_props: { fields: any }) {
  return null
}

// renderRow={(channel, index) => {
//   const topic = channel.topic ? channel.topic : ''
//   return {
//     key: `${index}`,
//     columns: {
//       name: {
//         sortValue: channel.name,
//         value: channel.name,
//       },
//       topic: {
//         sortValue: topic,
//         value: topic,
//       },
//       members: {
//         sortValue: channel.members,
//         value: channel.members,
//       },
//       createdAt: {
//         sortValue: channel.created,
//         type: 'date',
//         value: channel.created * 1000,
//       },
//       active: {
//         sortValue: true,
//         value: <CheckboxReactive isActive={() => true} />,
//       },
//     },
//   }
// }}
