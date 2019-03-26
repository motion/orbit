import { App, AppProps, createApp, List, OrbitListItemProps, Table } from '@o/kit'
import { Flow, FlowStep, Layout, Loading, Pane, Title } from '@o/ui'
import React, { useState } from 'react'

function CustomApp2(_props: AppProps) {
  return (
    <App>
      <Flow
        initialData={{
          selected: [],
        }}
      >
        <FlowStep
          title="Step 1"
          subTitle="Select your thing"
          validateFinished={data =>
            data.rows.length > 0
              ? true
              : {
                  rows: 'Need to select rows.',
                }
          }
        >
          {({ data, setData }) => {
            return (
              <Layout>
                <Pane>
                  123 123
                  <Table
                    showSearchBar
                    multiselect
                    onHighlighted={rows => setData({ selected: rows })}
                    rows={[
                      { title: 'Hello world', date: new Date(Date.now()) },
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
          {({ data, setData, done }) => (
            <MasterDetail
              items={[
                { title: 'Something', group: 'Hello', icon: 'test', subtitle: 'hello' },
                { title: 'Something', group: 'Hello', icon: 'smoe', subtitle: 'hello' },
                { title: 'Something', group: 'Hello', icon: 'hi', subtitle: 'hello' },
                { title: 'Something', group: 'Hello', icon: 'aos', subtitle: 'hello' },
                { title: 'Something', group: 'Hello', icon: 'dn', subtitle: 'hello' },
              ]}
            >
              {selected => (!selected ? <Loading /> : <Title>{selected.title}</Title>)}
            </MasterDetail>
          )}
        </FlowStep>
      </Flow>
    </App>
  )
}

export default createApp({
  id: 'custom2',
  name: 'Custom App 2',
  icon: '',
  app: CustomApp2,
})

///

{
  /* <GridLayout>
        <GridItem>hello 1234</GridItem>
      </GridLayout> */
}

type MasterDetailProps = {
  items: OrbitListItemProps[]
  children: (selected: OrbitListItemProps) => React.ReactNode
}

function MasterDetail(props: MasterDetailProps) {
  const [selected, setSelected] = useState(null)
  return (
    <Layout style="row">
      <Pane>
        <List
          dynamicHeight
          maxHeight={1000}
          items={props.items}
          onSelect={index => setSelected(props.items[index])}
          itemProps={{ iconBefore: true }}
        />
      </Pane>
      <Pane flex={1}>{props.children(selected)}</Pane>
    </Layout>
  )
}
