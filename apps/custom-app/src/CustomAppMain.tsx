import { AppProps, Table, useFetch } from '@o/kit'
import {
  Card,
  DefinitionList,
  Form,
  SearchInput,
  Section,
  Select,
  SpacedRow,
  Title,
  VerticalSplit,
  VerticalSplitPane,
} from '@o/ui'
import React, { useState } from 'react'

const useInputValue = null
const useFilters = null

const endpoint = 'https://jsonplaceholder.typicode.com'
const type = ['paid', 'trial', 'enterprise', 'power']
const active = ['active', 'inactive']

export function CustomAppMain(_props: AppProps) {
  const [highlighted, setHighlighted] = useState([])
  const rows = useFetch(`${endpoint}/users`).map((row, i) => ({
    ...row,
    type: type[i % (type.length - 1)],
    active: active[i % 2],
  }))

  return (
    <VerticalSplit>
      <VerticalSplitPane>
        <SpacedRow>
          <SearchInput name="search" />
          <Select name="active" options={active} />
          <Select name="type" isMulti options={type} />
        </SpacedRow>

        <Table
          multiHighlight
          onHighlighted={setHighlighted}
          rows={rows}
          searchTerm={useInputValue('search')}
          filters={useFilters(['active', 'type'])}
        />
      </VerticalSplitPane>

      <VerticalSplitPane>
        <Section>
          <Title>Hello World2</Title>
          <Card title="test" subtitle="another">
            {highlighted.length && <DefinitionList row={highlighted[0]} />}
          </Card>
          <Form rows={highlighted} />
        </Section>
      </VerticalSplitPane>
    </VerticalSplit>
  )
}

// filters={useFilters('active', 'type')}
// filters={[{ type: 'include', value: 'active', key: 'active' }]}

// searchable
// defaultFilters={[createEnumFilter(['error', 'debug', 'warn', 'fatal', 'verbose'])]}
