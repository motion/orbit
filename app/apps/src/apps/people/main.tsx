import { App, AppProps } from '@mcro/kit'
import React from 'react'
import { PeopleAppIndex } from './PeopleAppIndex'
import { PeopleAppMain } from './PeopleAppMain'
import { PersonItem } from './PersonItem'

export default function PeopleApp(props: AppProps) {
  return (
    <App index={<PeopleAppIndex />}>
      <PeopleAppMain {...props} />
    </App>
  )
}

export const config = {
  name: 'People',
  icon: 'person',
  itemView: PersonItem,
  itemName: 'person',
  modelType: 'person-bit',
}
