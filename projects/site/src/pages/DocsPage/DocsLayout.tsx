import { Card, Center, DefinitionList, Layout, Pane, SubTitle, Table } from '@o/ui'
import React, { useState } from 'react'

import { employees } from './fakeData'

export let Basic = () => {
  const [rows, setRows] = useState([])
  return (
    <Layout type="row" height={800} border={[1, 'red']}>
      <Pane resizable flex={1.5}>
        <Layout type="column">
          <Pane resizable>
            <Table
              columns={['username', 'dob', 'ssn']}
              selectable="multi"
              items={employees}
              onSelect={x => setRows(x)}
            />
          </Pane>
          <Pane space padding scrollable="x" flexDirection="row">
            {rows.map(row => (
              <Card key={row.id} title={row.name.first} subTitle={row.username} elevation={2} pad>
                <DefinitionList row={row} />
              </Card>
            ))}
          </Pane>
        </Layout>
      </Pane>

      <Pane>
        <Layout type="column">
          <Pane resizable collapsable title="Pane Title" flex={2}>
            <Center>
              <SubTitle>Resizable Pane</SubTitle>
            </Center>
          </Pane>
          <Pane>
            <Center>
              <SubTitle>Pane 4</SubTitle>
            </Center>
          </Pane>
          <Pane>
            <Center>
              <SubTitle>Pane 5</SubTitle>
            </Center>
          </Pane>
        </Layout>
      </Pane>
    </Layout>
  )
}
