import { App, AppDefinition, AppProps } from '@mcro/kit'
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

export const app: AppDefinition = {
  name: 'People',
  icon: 'person',
  itemType: 'person',
  app: PeopleApp,
  sync: {
    modelType: 'person-bit',
  },
}
