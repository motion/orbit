import { Avatar, List } from '@o/ui'
import faker from 'faker'
import React from 'react'

const avatar = (
  <Avatar width={28} height={28} src={require('../../../public/images/orbit-logo.svg')} />
)

const rows = [...new Array(10000)].map(() => ({
  title: faker.name.firstName(),
  subTitle: faker.lorem.sentence(),
  icon: 'home',
  createdAt: new Date(faker.date.past() * 1000),
  location: 'somewhere',
  iconBefore: true,
  children: faker.lorem.sentence(),
  after: avatar,
}))

export let One = <List height={500} items={rows} />
