import React from 'react'
import { PeopleAppIndex } from './PeopleAppIndex'
import { PeopleAppMain } from './PeopleAppMain'
import { PersonItem } from './PersonItem'

export const people = {
  app: function PeopleApp() {
    return (
      <App index={<PeopleAppIndex />}>
        <PeopleAppMain />
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
