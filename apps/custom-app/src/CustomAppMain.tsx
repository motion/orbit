import { AppProps, Table, useFetch } from '@o/kit'
import {
  Card,
  DefinitionList,
  Fieldsets,
  Form,
  Row,
  SearchInput,
  Select,
  SpacedRow,
  Tab,
  Tabs,
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
              <Tab label={row.name}>
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
  const albums = useFetch(`${endpoint}/albums?userId=${props.row.id}`)
  const [album, setAlbum] = useState(null)
  const albumPhotos = album && useFetch(`${endpoint}/photos?albumId=${album.id}`)
  const posts = useFetch(`${endpoint}/posts?userId=${props.row.id}`)

  console.log('albumPhotos', albumPhotos)

  return (
    <>
      <Fieldsets rows={[props.row]} />
      <Title>Albums</Title>
      <Table rows={albums} onHighlighted={rows => setAlbum(rows[0])} />

      {!!album && (
        <>
          <Title>
            {album.id} Album {album.title} Pictures
          </Title>
          <Table rows={albumPhotos} />
        </>
      )}
    </>
  )
}
