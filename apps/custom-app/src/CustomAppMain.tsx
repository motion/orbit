import { AppProps, Table, useFetch } from '@o/kit'
import {
  Card,
  DefinitionList,
  Fieldsets,
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

const useFormValue = (...a) => null
const useFormFilters = (...a) => null

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
        <Form>
          <SpacedRow>
            <SearchInput name="search" />
            <Select name="active" options={active} />
            <Select name="type" isMulti options={type} />
          </SpacedRow>

          <Table
            multiHighlight
            onHighlighted={setHighlighted}
            rows={rows}
            searchTerm={useFormValue('search')}
            filters={useFormFilters(['active', 'type'])}
          />
        </Form>
      </VerticalSplitPane>

      <VerticalSplitPane>
        <Section>
          <Title>Hello World2</Title>
          <Card title="test" subtitle="another">
            {highlighted.length && <DefinitionList row={highlighted[0]} />}
          </Card>
          <Fieldsets rows={highlighted} />
        </Section>
      </VerticalSplitPane>
    </VerticalSplit>
  )
}

// filters={useFilters('active', 'type')}
// filters={[{ type: 'include', value: 'active', key: 'active' }]}

// searchable
// defaultFilters={[createEnumFilter(['error', 'debug', 'warn', 'fatal', 'verbose'])]}
