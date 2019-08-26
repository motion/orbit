import { createApp } from '@o/kit'
import { Card, DefinitionList, Fetch, Fieldsets, Form, Layout, Pane, Row, Section, Select, Tab, Table, Tabs, useActiveSearchQuery, useCreateForm, useFetch } from '@o/ui'
import React, { useMemo, useState } from 'react'

export default createApp({
  id: 'demo-app-user-manager',
  name: 'App Demo: User Manager',
  icon: 'tool',
  iconColors: ['rgb(240, 18, 190)', 'rgb(220, 5, 170)'],
  app: DemoAppUserManager,
})

const endpoint = 'https://jsonplaceholder.typicode.com'
const type = ['paid', 'trial', 'enterprise', 'power']
const active = ['active', 'inactive']

function DemoAppUserManager() {
  const [highlighted, setHighlighted] = useState([])
  const form = useCreateForm()
  const allUsers = useFetch(`${endpoint}/users`)
  const users = useMemo(
    () =>
      allUsers.map((row, i) => ({
        ...row,
        type: type[i % (type.length - 1)],
        active: active[i % 2],
      })),
    [allUsers],
  )

  return (
    <Form useForm={form}>
      <Layout type="row">
        <Pane resizable flex={1.5}>
          <Layout type="column">
            <Pane resizable>
              <Row space="sm" padding="sm">
                <Select name="active" options={active} />
                <Select name="type" isMulti options={type} />
              </Row>
              <Table
                selectable="multi"
                shareable
                alwaysSelected
                query={useActiveSearchQuery()}
                onSelect={items => setHighlighted(items)}
                items={users}
                filters={form.getFilters(['active', 'type'])}
              />
            </Pane>
            <Pane space padding scrollable="x" flexDirection="row">
              {highlighted.map(row => (
                <Card
                  key={row.id}
                  title={row.name}
                  subTitle={row.username}
                  elevation={2}
                  padding
                  scrollable="y"
                >
                  <DefinitionList row={row} />
                </Card>
              ))}
            </Pane>
          </Layout>
        </Pane>

        <Pane>
          <Tabs
            defaultActive={highlighted.length ? highlighted[0].id : undefined}
            padding={10}
            centered
            sizeRadius={2}
            scrollable
          >
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

  if (!props.row) {
    return null
  }

  return (
    <Layout type="column">
      <Pane resizable>
        <Section scrollable="y" titleBorder title={props.row.name} padding>
          <Fieldsets items={[props.row]} />
        </Section>
      </Pane>
      <Pane resizable title="Albums">
        <Fetch url={`${endpoint}/albums?userId=${props.row.id}`}>
          {albums => <Table selectable items={albums} onSelect={items => setAlbum(items[0])} />}
        </Fetch>
      </Pane>
      <Pane resizable title={album ? `${album.id} Album ${album.title} Pictures` : ''}>
        {!!album && (
          <Fetch url={`${endpoint}/photos?albumId=${album.id}`}>
            {photos => <Table selectable="multi" searchable items={photos} />}
          </Fetch>
        )}
      </Pane>
    </Layout>
  )
}
