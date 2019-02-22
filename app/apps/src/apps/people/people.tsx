import { App, AppProps } from '@mcro/kit'
import React from 'react'
import { PeopleAppIndex } from './PeopleAppIndex'
import { PeopleAppMain } from './PeopleAppMain'
import { PersonItem } from './PersonItem'

export const people = {
  app: function PeopleApp(props: AppProps) {
    return (
      <App index={<PeopleAppIndex {...props} />}>
        <PeopleAppMain {...props} />
      </App>
    )
  },
  main: PeopleAppMain,
  item: PersonItem,
  modelType: 'person-bit',
  appName: 'People',
  display: {
    name: 'Directory',
    icon: 'person',
    itemName: 'person',
  },
}
