import { Avatar, Button, List } from '@o/ui'
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

export let Simple = (
  //
  <List height={350} items={rows} />
)

export let Grouping = (
  //
  <List groupByLetter items={rows.slice(0, 20)} height={350} />
)

export let OrderFilter = (
  //
  <List sortBy={x => x.subTitle} search="St" items={rows.slice(0, 200)} height={350} />
)

export let Selection = (
  //
  <List selectable items={rows.slice(0, 20)} height={350} />
)

export let MultipleSelection = (
  //
  <List selectable="multi" items={rows.slice(0, 20)} height={350} />
)

export let Section = (
  <List
    title="My List"
    subTitle="Subtitle for my section"
    afterTitle={
      <>
        <Button icon="wave" tooltip="Some tooltip" />
      </>
    }
    bordered
    backgrounded
    items={rows.slice(0, 20)}
    height={350}
  />
)
