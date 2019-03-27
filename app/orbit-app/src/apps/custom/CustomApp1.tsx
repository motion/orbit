import { AppProps, Table } from '@o/kit'
import {
  Card,
  DefinitionList,
  Fetch,
  Fieldsets,
  FloatingCard,
  Form,
  Layout,
  Pane,
  SearchInput,
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

export function CustomApp1(_props: AppProps) {
  const [highlighted, setHighlighted] = useState([])
  const form = useForm()
  const users = useFetch(`${endpoint}/users`).map((row, i) => ({
    ...row,
    type: type[i % (type.length - 1)],
    active: active[i % 2],
  }))

  return (
    <Form use={form}>
      <FloatingCard defaultTop={200} defaultLeft={400} title="Hello">
        lorem
      </FloatingCard>

      <Layout type="row">
        <Pane resizable>
          <Layout type="column">
            <Pane resizable>
              <SpacedRow>
                <SearchInput name="search" />
                <Select name="active" options={active} />
                <Select name="type" isMulti options={type} />
              </SpacedRow>
              <Table
                multiSelect
                onSelect={setHighlighted}
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
                  subtitle={row.username}
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
          <Tabs borderRadius={20} padding={10}>
            {highlighted.map(row => (
              <Tab key={row.id} label={row.name}>
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
        <Fieldsets rows={[props.row]} />
      </Pane>
      <Pane>
        <Fetch url={`${endpoint}/albums?userId=${props.row.id}`}>
          {albums => <Table title="Albums" rows={albums} onSelect={rows => setAlbum(rows[0])} />}
        </Fetch>
      </Pane>
      <Pane>
        {!!album && (
          <Fetch url={`${endpoint}/photos?albumId=${album.id}`}>
            {photos => (
              <Table
                multiSelect
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
