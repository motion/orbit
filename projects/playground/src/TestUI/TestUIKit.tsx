import { List, shallow, Table, useStore } from '@o/kit'
import {
  Card,
  DefinitionList,
  FloatingCard,
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

class Store {
  selected = shallow({})
}

export function TestUIKit() {
  const store = useStore(Store)
  const items = [
    { title: 'hello', icon: 'hi' },
    { title: 'hello2', subtitle: 'world', icon: 'hi' },
    { title: 'hello3', icon: 'hi' },
    { title: 'hello4', subtitle: 'world', icon: '4' },
    { title: 'hello', subtitle: 'world', icon: '5' },
    { title: 'hello', subtitle: 'world', icon: 'hi' },
    { title: 'bigbig', subtitle: 'world', icon: '3', iconBefore: true },
    { title: 'bigbig', icon: 'hi' },
    { title: 'hello', subtitle: 'world', icon: '2' },
    { title: 'hello', subtitle: 'world', icon: 'hi' },
    { title: 'hello', subtitle: 'world', icon: 'hi' },
  ]
  const [search, setSearch] = useState('')
  return (
    <Suspense fallback={<Loading />}>
      <SearchInput onChange={e => setSearch(e.target.value)} />
      <FloatingCard title="hi" defaultTop={200} defaultLeft={200}>
        <List selectable="multi" onSelect={i => (store.selected['x'] = items[i])} items={items} />
      </FloatingCard>
      <List
        searchable
        query={search}
        selectable="multi"
        onSelect={i => (store.selected['x'] = items[i])}
        items={items}
      />
      <SubView store={store} />
    </Suspense>
  )
}

function SubView(props: any) {
  const store = useStore(props.store)
  return <Title>test: {JSON.stringify(store.selected['x'] || null)}</Title>
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
