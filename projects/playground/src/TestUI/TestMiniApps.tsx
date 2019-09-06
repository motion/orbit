import { shallow, Templates, useStore } from '@o/kit'
import { Card, DefinitionList, FloatingCard, Flow, FlowStep, Form, GridItem, GridLayout, Layout, List, Loading, Pane, Row, SearchInput, Select, Table, Title, useFetch, useForm } from '@o/ui'
import React, { Suspense, useState } from 'react'

class Store {
  selected = shallow({})
}

export function TestMiniApps() {
  return (
    <Suspense fallback={<Loading />}>
      <CustomApp2 />
    </Suspense>
  )
}

export function CustomApp2() {
  return (
    <Flow
      data={{
        selected: [],
      }}
    >
      <FlowStep
        title="Step 1"
        subTitle="Select your thing"
        validateFinished={data =>
          data.items.length > 0
            ? true
            : {
                items: 'Need to select items.',
              }
        }
      >
        {({ data, setData }) => {
          return (
            <Layout type="row">
              <Pane resizable>
                <Table
                  searchable
                  selectable="multi"
                  onSelect={items => setData({ selected: items })}
                  items={[
                    {
                      title: 'Hello world Hello world Hello world Hello world Hello world',
                      date: new Date(Date.now()),
                    },
                    { title: 'Hello world', date: new Date(Date.now()) },
                    { title: 'Hello world', date: new Date(Date.now()) },
                  ]}
                />
              </Pane>
              <Pane>
                <List items={data.selected} />
              </Pane>
            </Layout>
          )
        }}
      </FlowStep>

      <FlowStep title="Step 2" subTitle="Select other thing">
        {(/* { data, setData, done } */) => (
          <Templates.MasterDetail
            items={[
              { title: 'Something', group: 'Hello', icon: 'test', subTitle: 'hello' },
              { title: 'Something', group: 'Hello', icon: 'smoe', subTitle: 'hello' },
              { title: 'Something', group: 'Hello', icon: 'hi', subTitle: 'hello' },
              { title: 'Something', group: 'Hello', icon: 'aos', subTitle: 'hello' },
              { title: 'Something', group: 'Hello', icon: 'dn', subTitle: 'hello' },
            ]}
          >
            {selected => (!selected ? <Loading /> : <Title>{selected.title}</Title>)}
          </Templates.MasterDetail>
        )}
      </FlowStep>

      <FlowStep title="Step 3" subTitle="Select other thing">
        <Templates.Message title="All set" icon="tick" />
      </FlowStep>
    </Flow>
  )
}

export function TestGrid() {
  const items = useFetch('https://jsonplaceholder.typicode.com/photos')
  return (
    <GridLayout>
      {items.slice(0, 10).map((item, index) => (
        <GridItem key={item.id} w={index === 0 ? 4 : 2} h={index === 0 ? 4 : 2}>
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
              <Row spacing>
                <SearchInput name="search" />
                <Select name="active" options={active} />
                <Select name="type" isMulti options={type} />
              </Row>
              <Table
                selectable="multi"
                onSelect={items => setHighlighted(items)}
                items={users}
                searchTerm={form.getValue('search')}
                filters={form.getFilters(['active', 'type'])}
              />
            </Pane>
            <Pane scrollable="x" flexDirection="row" padding={20}>
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
