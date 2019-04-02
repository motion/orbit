import { List, Table, Templates } from '@o/kit'
import { Flow, FlowStep, Layout, Loading, Pane, Title } from '@o/ui'
import React from 'react'

export function CustomApp2() {
  return (
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
            <Layout type="row">
              <Pane resizable>
                <Table
                  searchable
                  selectable="multi"
                  onSelect={rows => setData({ selected: rows })}
                  rows={[
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
        <Templates.Message title="All set" icon="check" />
      </FlowStep>
    </Flow>
  )
}
