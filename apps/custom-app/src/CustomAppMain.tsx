import { AppProps, Table } from '@o/kit'
import {
  Card,
  DefinitionList,
  Fetch,
  Fieldsets,
  FloatingView,
  Form,
  Row,
  SearchInput,
  Select,
  SpacedRow,
  Tab,
  Tabs,
  useFetch,
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
  const users = useFetch(`${endpoint}/users`).map((row, i) => ({
    ...row,
    type: type[i % (type.length - 1)],
    active: active[i % 2],
  }))

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
            rows={users}
            searchTerm={form.getValue('search')}
            filters={form.getFilters(['active', 'type'])}
          />

          <FloatingView resizable zIndex={10000000} defaultTop={20} defaultLeft={20}>
            <Card title="Hello" elevation={2} flex={1}>
              lorem
            </Card>
          </FloatingView>

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
        </VerticalSplitPane>
        <VerticalSplitPane>
          <Tabs borderRadius={20} margin={2}>
            {highlighted.map(row => (
              <Tab key={row.id} label={row.name}>
                <PersonInfo row={row} />
              </Tab>
            ))}
          </Tabs>
        </VerticalSplitPane>
      </VerticalSplit>
    </Form>
  )
}

function PersonInfo(props: { row: any }) {
  const [album, setAlbum] = useState(null)
  return (
    <>
      <Fieldsets rows={[props.row]} />
      <Fetch url={`${endpoint}/albums?userId=${props.row.id}`}>
        {albums => <Table title="Albums" rows={albums} onHighlighted={rows => setAlbum(rows[0])} />}
      </Fetch>
      {!!album && (
        <Fetch url={`${endpoint}/photos?albumId=${album.id}`}>
          {photos => <Table title={`${album.id} Album ${album.title} Pictures`} rows={photos} />}
        </Fetch>
      )}
    </>
  )
}
