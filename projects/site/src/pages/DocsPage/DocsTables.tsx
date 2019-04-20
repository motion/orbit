import { Table } from '@o/ui'
import React from 'react'

import { employees } from './fakeData'

const rows = [...new Array(10000)].map((_, i) => employees[i % (employees.length - 1)])

export let One = (
  <Table
    overscanCount={100}
    height={500}
    columns={['username', 'password', 'ssn', 'dob']}
    rows={rows}
  />
)
