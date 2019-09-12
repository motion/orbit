import { Avatar, Button, Col, DateFormat, List, Scale } from '@o/ui'
import React from 'react'

import { employees } from './fakeData'

const avatar = <Avatar width={32} height={32} src={require('../../public/images/nate.jpg')} />

const rows = employees.map(x => ({
  key: `${x.email}${x.dob}${x.name.first}`,
  title: x.name.first + ' ' + x.name.last,
  subTitle: x.email,
  icon: x.gender ? 'man' : 'ok',
  createdAt: x.dob,
  location: x.address.city,
  after: (
    <Col userSelect="none">
      <DateFormat date={new Date(x.dob)} />
    </Col>
  ),
  before: avatar,
}))

const simpleRows = employees.slice(0, 30).map(x => ({
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
    items={simpleRows.map(row => ({
      ...row,
      children: 'You can add children below the content area.',
    }))}
    height={300}
    itemProps={{
      titleProps: {
        fontWeight: 600,
      },
    }}
  />
)

export let Grouping = (
  <List
    sortBy={x => x.subTitle}
    // you can also use a groupBy function
    groupByLetter
    items={rows.slice(0, 20)}
    height={300}
  />
)

export let OrderFilter = (
  <List
    items={rows.slice(0, 200)}
    // filter by "St"
    searchable
    query="St"
    // then sort by subTitle
    sortBy={x => x.subTitle}
    height={300}
  />
)

export let Filtering = (
  <List
    // allows single selection
    selectable
    searchable
    filters={[
      {
        type: 'inclusive',
        value: 'something',
      },
    ]}
    items={rows.slice(0, 20)}
    height={300}
  />
)

export let Selection = (
  <List
    // allows single selection
    selectable
    items={rows.slice(0, 20)}
    height={300}
  />
)

export let MultipleSelection = (
  <List
    // allows multiple selection
    selectable="multi"
    items={rows.slice(0, 20)}
    height={400}
    sortable
  />
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
    searchable
    bordered
    backgrounded
    items={rows.slice(0, 20)}
    height={350}
  />
)
