import { AppProps, Table } from '@o/kit'
import {
  Card,
  createEnumFilter,
  DataType,
  Form,
  Section,
  Title,
  VerticalSplit,
  VerticalSplitPane,
} from '@o/ui'
import faker from 'faker'
import React, { useState } from 'react'

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

const columns = {
  name: {
    value: 'Name',
  },
  topic: {
    value: 'Topic',
  },
  members: {
    value: 'Members',
    type: DataType.number,
  },
  createdAt: {
    value: 'Created',
    type: DataType.date,
  },
  active: {
    value: 'Active',
    type: DataType.boolean,
  },
}

export function CustomAppMain(_props: AppProps) {
  const [highlighted, setHighlighted] = useState([])

  return (
    <VerticalSplit>
      <VerticalSplitPane>
        <Table
          searchable
          multiHighlight
          onHighlightedRows={setHighlighted}
          rows={rows}
          defaultFilters={[createEnumFilter(rowTypes)]}
          columns={columns}
        />
      </VerticalSplitPane>

      <VerticalSplitPane>
        <Section>
          <Title>Hello World2</Title>

          <Card title="test" subtitle="another">
            hello world
          </Card>

          <Form columns={columns} rows={highlighted} />
        </Section>
      </VerticalSplitPane>
    </VerticalSplit>
  )
}
