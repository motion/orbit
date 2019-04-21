import { Avatar, List } from '@o/ui'
import React from 'react'

import { employees } from './fakeData'

const avatar = (
  <Avatar width={28} height={28} src={require('../../../public/images/orbit-logo.svg')} />
)

const rows = employees.map(x => ({
  title: x.name.first + ' ' + x.name.last,
  subTitle: x.email,
  icon: x.gender,
  createdAt: x.dob,
  location: x.address.city,
  iconBefore: true,
  children: x.username,
  after: avatar,
}))

export default <List overscanCount={1000} height={500} items={rows} />
