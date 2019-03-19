import { AppProps, Table, useFetch } from '@o/kit'
import {
  Card,
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
const type = ['paid', 'trial', 'enterprise', 'power']
const active = ['active', 'inactive']

export function CustomAppMain(_props: AppProps) {
  const [highlighted, setHighlighted] = useState([])
  const rows = useFetch(`${endpoint}/users`).map((row, i) => ({
    ...row,
    category: type[i % (type.length - 1)],
    active: active[i % 2],
  }))

  return (
    <VerticalSplit>
      <VerticalSplitPane>
        <Row alignItems="center" padding={[0, 5]} width="100%">
          <SearchInput />
          <HorizontalSpace />
          <Select options={active} />
          <HorizontalSpace />
          <Select isMulti options={type} />
        </Row>

        <Table multiHighlight onHighlighted={setHighlighted} rows={rows} />
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

// searchable
// defaultFilters={[createEnumFilter(['error', 'debug', 'warn', 'fatal', 'verbose'])]}
