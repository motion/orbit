import { AppProps, Table, useFetch } from '@o/kit'
import {
  Card,
  createEnumFilter,
  Form,
  Section,
  Title,
  VerticalSplit,
  VerticalSplitPane,
} from '@o/ui'
import React, { useState } from 'react'

const endpoint = 'https://jsonplaceholder.typicode.com'
const rowTypes = ['error', 'debug', 'warn', 'fatal', 'verbose', 'info']

export function CustomAppMain(_props: AppProps) {
  const [highlighted, setHighlighted] = useState([])
  const rows = useFetch(`${endpoint}/users`)

  return (
    <VerticalSplit>
      <VerticalSplitPane>
        <Table
          searchable
          onHighlighted={setHighlighted}
          rows={rows}
          defaultFilters={[createEnumFilter(rowTypes)]}
        />
      </VerticalSplitPane>

      <VerticalSplitPane>
        <Section>
          <Title>Hello World2</Title>

          <Card title="test" subtitle="another">
            hello world
          </Card>

          <Form rows={highlighted} />
        </Section>
      </VerticalSplitPane>
    </VerticalSplit>
  )
}
