import { App, AppDefinition, AppProps } from '@mcro/kit'
import React from 'react'
import { PeopleAppIndex } from './PeopleAppIndex'
import { PeopleAppMain } from './PeopleAppMain'

export const PeopleApp: AppDefinition = {
  id: 'people',
  name: 'People',
  icon: 'person',
  itemType: 'person',
  app: (props: AppProps) => (
    <App index={<PeopleAppIndex />}>
      <PeopleAppMain {...props} />
    </App>
  ),
  sync: {
    modelType: 'person-bit',
  },
}
