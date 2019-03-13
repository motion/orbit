import { App, AppProps, createApp } from '@o/kit'
import React from 'react'
import { PeopleAppIndex } from './PeopleAppIndex'
import { PeopleAppMain } from './PeopleAppMain'

function PeopleApp(props: AppProps) {
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
