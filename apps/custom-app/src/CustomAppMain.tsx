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

const userColumns = {
  name: 'Name',
  username: 'Username',
  email: 'Email',
  phone: 'Phone',
  website: 'Website',
}

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
          columns={userColumns}
          defaultFilters={[createEnumFilter(rowTypes)]}
        />
      </VerticalSplitPane>

      <VerticalSplitPane>
        <Section>
          <Title>Hello World2</Title>

          <Card title="test" subtitle="another">
            hello world
          </Card>

          <Form columns={userColumns} rows={highlighted} />
        </Section>
      </VerticalSplitPane>
    </VerticalSplit>
  )
}
