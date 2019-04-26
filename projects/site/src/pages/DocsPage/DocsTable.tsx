import { Button, List, Table } from '@o/ui'
import React, { useState } from 'react'

import { employees } from './fakeData'

const data = [...new Array(10000)].map((_, i) => employees[i % (employees.length - 1)])

export let Simple = (
  <Table
    overscanCount={100}
    height={300}
    columns={['username', 'password', 'ssn', 'dob']}
    rows={data}
  />
)

export let Columns = (
  <Table
    height={250}
    columns={[
      {
        key: 'username',
        value: 'User Name',
        onChange(next) {
          console.log('change', next)
        },
        resizable: false,
        flex: 3,
        sortable: false,
      },
      'password',
      'ssn',
      'dob',
    ]}
    rows={employees}
  />
)

export let Selections = () => {
  const [rows, setRows] = useState([])
  return (
    <>
      <Table height={250} selectable="multi" onSelect={setRows} rows={employees} />
      <List
        title="Selected"
        height={200}
        items={rows.map(employee => ({
          title: employee.username,
          subTitle: employee.ssn,
        }))}
      />
    </>
  )
}

export let Filters = (
  <Table
    height={250}
    filters={[
      {
        value: 'beau',
        type: 'include',
        key: 'username',
      },
    ]}
    rows={employees}
  />
)

export let Searching = (
  //
  <Table searchable height={250} rows={employees} />
)

export let Section = (
  <Table
    title="My List"
    subTitle="Subtitle for my section"
    collapsable
    searchable
    afterTitle={
      <>
        <Button icon="wave" tooltip="Some tooltip" />
      </>
    }
    bordered
    backgrounded
    rows={employees}
    height={250}
  />
)