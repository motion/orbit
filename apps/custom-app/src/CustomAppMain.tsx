import { AppProps, Table, useFetch } from '@o/kit'
import {
  Card,
  createEnumFilter,
  DefinitionList,
  Form,
  HorizontalSpace,
  Row,
  SearchInput,
  Section,
  Select,
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
        <Row alignItems="center" padding={2} width="100%">
          <SearchInput />
          <HorizontalSpace />
          <Select options={['unknown', 'active', 'inactive']} />
          <HorizontalSpace />
          <Select options={['1', '2', '3']} isMulti />
        </Row>

        <Table
          searchable
          multiHighlight
          onHighlighted={setHighlighted}
          rows={rows}
          defaultFilters={[createEnumFilter(rowTypes)]}
        />
      </VerticalSplitPane>

      <VerticalSplitPane>
        <Section>
          <Title>Hello World2</Title>

          <Card title="test" subtitle="another">
            {rows.length && <DefinitionList row={rows[0]} />}
          </Card>

          <Form rows={highlighted} />
        </Section>
      </VerticalSplitPane>
    </VerticalSplit>
  )
}
