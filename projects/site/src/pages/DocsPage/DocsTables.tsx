import { Table } from '@o/ui'
import React from 'react'

import { employees } from './fakeData'

const rows = [...new Array(10000)].map((_, i) => employees[i % (employees.length - 1)])

export let Simple = (
  <Table
    overscanCount={100}
    height={300}
    columns={['username', 'password', 'ssn', 'dob']}
    rows={rows}
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
