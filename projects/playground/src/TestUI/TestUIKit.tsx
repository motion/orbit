import { List, shallow, Table, useStore } from '@o/kit'
import {
  Card,
  DefinitionList,
  FloatingCard,
  Form,
  GridItem,
  GridLayout,
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
  return (
    <Suspense fallback={<Loading />}>
      <TestGrid />
    </Suspense>
  )
}

export function TestGrid() {
  const items = useFetch('https://jsonplaceholder.typicode.com/photos')
  return (
    <GridLayout>
      {items.slice(0, 10).map(item => (
        <GridItem key={item.id}>
          <Card flex={1} overflow="hidden" title={item.title}>
            <img src={item.url} />
          </Card>
        </GridItem>
      ))}
    </GridLayout>
  )
}

export function TestList() {
  const store = useStore(Store)
  const items = [
    { title: 'hello', icon: 'hi' },
    { title: 'hello2', subTitle: 'world', icon: 'hi' },
    { title: 'hello3', icon: 'hi' },
    { title: 'hello4', subTitle: 'world', icon: '4' },
    { title: 'hello', subTitle: 'world', icon: '5' },
    { title: 'hello', subTitle: 'world', icon: 'hi' },
    { title: 'bigbig', subTitle: 'world', icon: '3', iconBefore: true },
    { title: 'bigbig', icon: 'hi' },
    { title: 'hello', subTitle: 'world', icon: '2' },
    { title: 'hello', subTitle: 'world', icon: 'hi' },
    { title: 'hello', subTitle: 'world', icon: 'hi' },
  ]
  const [search, setSearch] = useState('')
  return (
    <Suspense fallback={<Loading />}>
      <SearchInput onChange={e => setSearch(e.target.value)} />
      <FloatingCard title="hi" defaultTop={200} defaultLeft={200}>
        <List selectable="multi" onSelect={i => (store.selected['x'] = items[i])} items={items} />
      </FloatingCard>
      <List
        search={search}
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
          <Title>hello</Title>>
        </Pane>
      </Layout>
    </Form>
  )
}
