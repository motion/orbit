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
  useForm,
  VerticalSplit,
  VerticalSplitPane,
} from '@o/ui'
import React, { useState } from 'react'

const endpoint = 'https://jsonplaceholder.typicode.com'
const type = ['paid', 'trial', 'enterprise', 'power']
const active = ['active', 'inactive']

export function CustomAppMain(_props: AppProps) {
  const [highlighted, setHighlighted] = useState([])
  const form = useForm()
  const rows = useFetch(`${endpoint}/users`).map((row, i) => ({
    ...row,
    type: type[i % (type.length - 1)],
    active: active[i % 2],
  }))

  console.log('form.getfilters', form.getFilters(['active', 'type']))

  return (
    <Form use={form}>
      <VerticalSplit>
        <VerticalSplitPane>
          <SpacedRow>
            <SearchInput name="search" />
            <Select name="active" options={active} />
            <Select name="type" isMulti options={type} />
          </SpacedRow>
          <Table
            multiselect
            onHighlighted={setHighlighted}
            rows={rows}
            searchTerm={form.getValue('search')}
            filters={form.getFilters(['active', 'type'])}
          />
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
    </Form>
  )
}

// filters={useFilters('active', 'type')}
// filters={[{ type: 'include', value: 'active', key: 'active' }]}

// searchable
// defaultFilters={[createEnumFilter(['error', 'debug', 'warn', 'fatal', 'verbose'])]}
