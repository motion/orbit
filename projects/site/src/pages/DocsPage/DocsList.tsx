import { Avatar, Button, List, Scale } from '@o/ui'
import React from 'react'

import { employees } from './fakeData'

const avatar = (
  <Avatar width={28} height={28} src={require('../../../public/images/orbit-logo.svg')} />
)

const rows = employees.map(x => ({
  title: x.name.first + ' ' + x.name.last,
  subTitle: x.email,
  icon: x.gender ? 'man' : 'woman',
  createdAt: x.dob,
  location: x.address.city,
  iconBefore: true,
  children: x.username,
  after: avatar,
}))

const simpleRows = employees.map(x => ({
  title: x.name.first + ' ' + x.name.last,
  subTitle: x.email,
  icon: 'pane',
  createdAt: x.dob,
  location: x.address.city,
}))

export let Simple = (
  //
  <List height={300} items={rows} />
)

export let SimpleAlt = (
  //
  <List
    items={simpleRows}
    height={300}
    itemProps={{
      titleProps: {
        fontWeight: 600,
      },
    }}
  />
)

export let Grouping = (
  //
  <List sortBy={x => x.subTitle} groupByLetter items={rows.slice(0, 20)} height={300} />
)

export let OrderFilter = (
  //
  <List sortBy={x => x.subTitle} search="St" items={rows.slice(0, 200)} height={300} />
)

export let Selection = (
  //
  <List selectable items={rows.slice(0, 20)} height={300} />
)

export let MultipleSelection = (
  //
  <List selectable="multi" items={rows.slice(0, 20)} height={300} />
)

export let Scaling = (
  <Scale size={2}>
    <List items={rows.slice(0, 20)} height={300} />
  </Scale>
)

export let Section = (
  <List
    title="My List"
    subTitle="Subtitle for my section"
    collapsable
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
