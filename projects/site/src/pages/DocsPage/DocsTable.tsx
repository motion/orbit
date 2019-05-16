import { Button, List, Scale, Table } from '@o/ui'
import { pick } from 'lodash'
import React, { useState } from 'react'

import { employees as allEmployees } from './fakeData'

const cols = ['username', 'password', 'ssn', 'dob', 'email', 'department']
const employees = allEmployees.map(x => pick(x, cols))
const data = [...new Array(1000)].map((_, i) => employees[i % (employees.length - 1)])

export let simple = (
  <Table
    selectable="multi"
    height={300}
    columns={[{ key: 'username', value: 'Username', flex: 2 }, 'password', 'ssn', 'dob']}
    items={data}
  />
)

export let columns = (
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
    items={employees}
  />
)

export let selections = () => {
  const [items, setItems] = useState([])
  return (
    <>
      <Table height={250} selectable="multi" onSelect={setItems} items={employees} />
      <List
        title="Selected"
        height={200}
        items={items.map(employee => ({
          title: employee.username,
          subTitle: employee.ssn,
        }))}
      />
    </>
  )
}

export let filters = (
  <Table
    height={250}
    filters={[
      {
        value: 'beau',
        type: 'include',
        key: 'username',
      },
    ]}
    items={employees}
  />
)

export let searching = (
  //
  <Table searchable height={250} items={employees} />
)

export let section = (
  <Table
    title="My List"
    subTitle="Subtitle for my section"
    selectable="multi"
    collapsable
    searchable
    filters={[
      {
        type: 'exclude',
        key: 'department',
        value: 'Marketing',
      },
    ]}
    afterTitle={
      <>
        <Button icon="ex" tooltip="Example action button" />
      </>
    }
    bordered
    backgrounded
    items={employees}
    height={250}
  />
)

export let scale = (
  <Scale size={1.5}>
    <Table
      title="My List"
      subTitle="Subtitle for my section"
      collapsable
      searchable
      bordered
      items={employees}
      height={250}
    />
  </Scale>
)
