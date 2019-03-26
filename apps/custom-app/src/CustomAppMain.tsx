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
  Row,
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

export function CustomAppMain(_props: AppProps) {
  const [highlighted, setHighlighted] = useState([])
  const form = useForm()
  const users = useFetch(`${endpoint}/users`).map((row, i) => ({
    ...row,
    type: type[i % (type.length - 1)],
    active: active[i % 2],
  }))

  return (
    <Form use={form}>
      <Layout type="row">
        <Pane>
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

          <FloatingCard title="Hello">lorem</FloatingCard>

          <Row overflowX="auto">
            {highlighted.map(row => (
              <Card
                key={row.id}
                title={row.name}
                subtitle={row.username}
                minWidth={200}
                minHeight={200}
              >
                <DefinitionList row={row} />
              </Card>
            ))}
          </Row>
        </Pane>
        <Pane>
          <Tabs borderRadius={20} margin={2}>
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
    <>
      <Fieldsets rows={[props.row]} />
      <Fetch url={`${endpoint}/albums?userId=${props.row.id}`}>
        {albums => <Table title="Albums" rows={albums} onSelect={rows => setAlbum(rows[0])} />}
      </Fetch>
      {!!album && (
        <Fetch url={`${endpoint}/photos?albumId=${album.id}`}>
          {photos => <Table title={`${album.id} Album ${album.title} Pictures`} rows={photos} />}
        </Fetch>
      )}
    </>
  )
}
