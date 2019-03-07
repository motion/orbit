import { App, AppMainProps, createApp } from '@o/kit'
import React from 'react'
import { PeopleAppIndex } from './PeopleAppIndex'
import { PeopleAppMain } from './PeopleAppMain'

function PeopleApp(props: AppMainProps) {
  return (
    <App index={<PeopleAppIndex />}>
      <PeopleAppMain {...props} />
    </App>
  )
}

export default createApp({
  id: 'people',
  name: 'People',
  icon: 'person',
  itemType: 'person',
  app: PeopleApp,
})
