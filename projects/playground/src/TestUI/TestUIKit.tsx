import { List, Table, Templates } from '@o/kit'
import { Flow, FlowStep, Layout, Loading, Pane, Title } from '@o/ui'
import React from 'react'

export function TestUIKit() {
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
            <Layout style="row">
              <Pane>
                <Table
                  searchable
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
          <Templates.MasterDetail
            items={[
              { title: 'Something', group: 'Hello', icon: 'test', subtitle: 'hello' },
              { title: 'Something', group: 'Hello', icon: 'smoe', subtitle: 'hello' },
              { title: 'Something', group: 'Hello', icon: 'hi', subtitle: 'hello' },
              { title: 'Something', group: 'Hello', icon: 'aos', subtitle: 'hello' },
              { title: 'Something', group: 'Hello', icon: 'dn', subtitle: 'hello' },
            ]}
          >
            {selected => (!selected ? <Loading /> : <Title>{selected.title}</Title>)}
          </Templates.MasterDetail>
        )}
      </FlowStep>
    </Flow>
  )
}
