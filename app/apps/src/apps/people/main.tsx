import { App, AppProps } from '@mcro/kit'
import React from 'react'
import { PeopleAppIndex } from './PeopleAppIndex'
import { PeopleAppMain } from './PeopleAppMain'
import { PersonItem } from './PersonItem'

export default function Main(props: AppProps) {
  return (
    <App index={<PeopleAppIndex {...props} />}>
      <PeopleAppMain {...props} />
    </App>
  )
}

export const people = {
  views: {
    main: PeopleAppMain,
    item: PersonItem,
  },
  modelType: 'person-bit',
  appName: 'People',
  display: {
    name: 'Directory',
    icon: 'person',
    itemName: 'person',
  },
}
