import { AppProps, Table } from '@o/kit'
import {
  createEnumFilter,
  DataType,
  GenericDataRow,
  getDataType,
  Title,
  VerticalSplit,
  VerticalSplitPane,
} from '@o/ui'
import faker from 'faker'
import React, { useState } from 'react'

const rowTypes = ['error', 'debug', 'warn', 'fatal', 'verbose', 'info']

const rows = [...new Array(10000)].map((_, index) => ({
  key: `${index}`,
  category: rowTypes[index % 3],
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
          onHighlightedRows={setHighlighted}
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
          }}
        />
      </VerticalSplitPane>

      <VerticalSplitPane>
        <Title bordered>Hello World</Title>
        <Form values={highlighted} />
      </VerticalSplitPane>
    </VerticalSplit>
  )
}

function Form(props: { values: GenericDataRow[] | null }) {
  if (!props.values || props.values.length === 0) {
    return null
  }
  const firstRow = props.values[0]
  const fieldTypes = Object.keys(firstRow.values).map(k => getDataType(firstRow.values[k]))
  console.log('highlighted', props.values, fieldTypes)
  return <Title>{JSON.stringify({ fieldTypes })}</Title>
}
