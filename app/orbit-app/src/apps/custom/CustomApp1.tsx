import { Table } from '@o/kit'
import {
  Card,
  DefinitionList,
  Fetch,
  Fieldsets,
  Form,
  Layout,
  Pane,
  SearchInput,
  Section,
  Select,
  SpacedRow,
  Tab,
  Tabs,
  useFetch,
  useForm,
} from '@o/ui'
import React, { useState } from 'react'

const endpoint = 'https://jsonplaceholder.typicode.com'
const type = ['paid', 'trial', 'enterprise', 'power']
const active = ['active', 'inactive']

export function CustomApp1() {
  const [highlighted, setHighlighted] = useState([])
  const form = useForm()
  const users = useFetch(`${endpoint}/users`).map((row, i) => ({
    ...row,
    type: type[i % (type.length - 1)],
    active: active[i % 2],
  }))

  console.log('users', users)

  return (
    <Form use={form}>
      <Layout type="row">
        <Pane resizable flex={1.5}>
          <Layout type="column">
            <Pane resizable>
              <SpacedRow>
                <SearchInput name="search" />
                <Select name="active" options={active} />
                <Select name="type" isMulti options={type} />
              </SpacedRow>
              <Table
                selectable="multi"
                shareable
                onSelect={rows => setHighlighted(rows)}
                rows={users}
                searchTerm={form.getValue('search')}
                filters={form.getFilters(['active', 'type'])}
              />
            </Pane>
            <Pane scrollable="x" flexFlow="row" padding={20}>
              {highlighted.map(row => (
                <Card
                  key={row.id}
                  title={row.name}
                  subTitle={row.username}
                  minWidth={200}
                  minHeight={200}
                  marginRight={20}
                  elevation={1}
                >
                  <DefinitionList row={row} />
                </Card>
              ))}
            </Pane>
          </Layout>
        </Pane>

        <Pane>
          <Tabs padding={10}>
            {highlighted.map(row => (
              <Tab key={row.id} id={row.id} label={row.name}>
                <PersonInfo row={row} />
              </Tab>
            ))}
          </Tabs>
        </Pane>
      </Layout>
    </Form>
  )
}

function PersonInfo(props: { row: any }) {
  const [album, setAlbum] = useState(null)
  return (
    <Layout type="column">
      <Pane scrollable>
        <Section scrollable bordered title={props.row.name}>
          <Fieldsets rows={[props.row]} />
        </Section>
      </Pane>
      <Pane>
        <Fetch url={`${endpoint}/albums?userId=${props.row.id}`}>
          {albums => (
            <Table
              selectable
              bordered
              title="Albums"
              rows={albums}
              onSelect={rows => setAlbum(rows[0])}
            />
          )}
        </Fetch>
      </Pane>
      <Pane>
        {!!album && (
          <Fetch url={`${endpoint}/photos?albumId=${album.id}`}>
            {photos => (
              <Table
                bordered
                selectable="multi"
                searchable
                title={`${album.id} Album ${album.title} Pictures`}
                rows={photos}
              />
            )}
          </Fetch>
        )}
      </Pane>
    </Layout>
  )
}
