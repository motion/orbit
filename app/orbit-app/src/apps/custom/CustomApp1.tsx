import {
  Card,
  DefinitionList,
  Fetch,
  Fieldsets,
  Form,
  Layout,
  Pane,
  Row,
  SearchInput,
  Section,
  Select,
  Tab,
  Table,
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

  console.log('ok', form.getValue('search'), form.getFilters(['active', 'type']))

  return (
    <Form use={form}>
      <Layout type="row">
        <Pane resizable flex={1.5}>
          <Layout type="column">
            <Pane resizable>
              <Row space spaceAround pad>
                <SearchInput name="search" />
                <Select name="active" options={active} />
                <Select name="type" isMulti options={type} />
              </Row>
              <Table
                selectable="multi"
                shareable
                onSelect={rows => setHighlighted(rows)}
                rows={users}
                searchTerm={form.getValue('search')}
                filters={form.getFilters(['active', 'type'])}
              />
            </Pane>
            <Pane space pad scrollable="x" flexDirection="row">
              {highlighted.map(row => (
                <Card
                  key={row.id}
                  title={row.name}
                  subTitle={row.username}
                  elevation={2}
                  pad
                  scrollable="y"
                >
                  <DefinitionList row={row} />
                </Card>
              ))}
            </Pane>
          </Layout>
        </Pane>

        <Pane>
          <Tabs padding={10} centered sizeRadius={2}>
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
      <Pane>
        <Section scrollable="y" bordered title={props.row.name}>
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
