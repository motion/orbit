import { AppProps, Table } from '@o/kit'
import {
  createEnumFilter,
  DataColumns,
  DataType,
  FormField,
  GenericDataRow,
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
  category: rowTypes[index % 3],
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
          multiHighlight
          onHighlightedRows={setHighlighted}
          rows={rows}
          defaultFilters={[createEnumFilter(rowTypes)]}
          columns={columns}
        />
      </VerticalSplitPane>

      <VerticalSplitPane>
        <Section>
          <Title>Hello World</Title>
          <Form columns={columns} rows={highlighted} />
        </Section>
      </VerticalSplitPane>
    </VerticalSplit>
  )
}

type FormProps = { columns: DataColumns; rows: GenericDataRow[] | null }

function Form({ columns, rows }: FormProps) {
  if (!rows || rows.length === 0) {
    return null
  }

  return (
    <>
      <Title>{JSON.stringify({ columns, rows })}</Title>
      {rows.map(row => {
        return Object.keys(row.values).map(valKey => {
          const value = row.values[valKey]
          return (
            <FormField
              key={value.key}
              type={columns[valKey].type}
              label={columns[valKey].value}
              value={value}
            />
          )
        })
      })}
    </>
  )
}
