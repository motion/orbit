import { App, createApp } from '@o/kit'
import React from 'react'
import { PeopleAppIndex, PeopleAppMain } from './PeopleApp'

export default createApp({
  id: 'people',
  name: 'People',
  icon: 'person',
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
