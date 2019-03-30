import { List, Table } from '@o/kit'
import {
  Card,
  DefinitionList,
  Form,
  Layout,
  Loading,
  Pane,
  SearchInput,
  Select,
  SpacedRow,
  Title,
  useFetch,
  useForm,
} from '@o/ui'
import React, { Suspense, useState } from 'react'

export function TestUIKit() {
  return (
    <Suspense fallback={<Loading />}>
      <List
        selectable="multi"
        items={[
          { title: 'hello', subtitle: 'world', icon: 'hi' },
          { title: 'hello', subtitle: 'world', icon: 'hi' },
          { title: 'hello', subtitle: 'world', icon: 'hi' },
          { title: 'hello', subtitle: 'world', icon: 'hi' },
          { title: 'hello', subtitle: 'world', icon: 'hi' },
          { title: 'hello', subtitle: 'world', icon: 'hi' },
          { title: 'hello', subtitle: 'world', icon: 'hi' },
          { title: 'hello', subtitle: 'world', icon: 'hi' },
          { title: 'hello', subtitle: 'world', icon: 'hi' },
          { title: 'hello', subtitle: 'world', icon: 'hi' },
          { title: 'hello', subtitle: 'world', icon: 'hi' },
        ]}
      />

      {/* <CustomApp1 /> */}
    </Suspense>
  )
}

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
      {/* <FloatingCard attach="bottomright" title="Hello">
        lorem
      </FloatingCard> */}

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
          <Title>hello</Title>>
        </Pane>
      </Layout>
    </Form>
  )
}
