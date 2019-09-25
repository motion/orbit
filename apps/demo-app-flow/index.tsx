import { createApp, Templates } from '@o/kit'
import { Flow, FlowStep, Layout, List, Loading, Pane, Table, Title } from '@o/ui'
import React from 'react'

export default createApp({
  id: 'demo-app-flow',
  name: 'App Demo: Flow',
  icon: 'go',
  iconColors: ['rgb(255, 133, 27)', 'rgb(235, 123, 17)'],
  app: DemoAppFlow,
  viewConfig: {
    transparentBackground: false,
  },
})

function DemoAppFlow() {
  return (
    <Flow
      id="demo-app-flow"
      data={{
        selected: [],
      }}
    >
      <FlowStep
        title="Select App"
        subTitle="Select your thing"
        validateFinished={data =>
          data.rows && data.rows.length > 0
            ? true
            : {
                rows: 'Need to select rows.',
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
                  onSelect={rows => setData({ selected: rows })}
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
              { title: 'Something', groupName: 'Hello', icon: 'test', subTitle: 'hello' },
              { title: 'Something', groupName: 'Hello', icon: 'smoe', subTitle: 'hello' },
              { title: 'Something', groupName: 'Hello', icon: 'hi', subTitle: 'hello' },
              { title: 'Something', groupName: 'Hello', icon: 'aos', subTitle: 'hello' },
              { title: 'Something', groupName: 'Hello', icon: 'dn', subTitle: 'hello' },
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
