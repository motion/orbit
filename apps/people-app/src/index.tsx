import { App, createApp } from '@o/kit'
import React from 'react'

import { PeopleAppIndex, PeopleAppMain } from './PeopleApp'

export default createApp({
  id: 'people',
  name: 'People',
  icon: 'person',
  iconColors: ['rgb(133, 20, 75)', 'rgb(123, 10, 65)'],
  itemType: 'person',
  app: props => (
    <App index={<PeopleAppIndex />}>
      <PeopleAppMain {...props} />
    </App>
  ),
  viewConfig: {
    acceptsSearch: true,
  },
})
