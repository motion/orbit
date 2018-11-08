import * as React from 'react'
import { useStore } from '@mcro/use-store'
import { MenuItem } from './MenuItem'
import { observeMany } from '@mcro/model-bridge'
import { PersonBitModel, PersonBit } from '@mcro/models'
import { Menu } from './Menu'
import { MenusStore } from './MenuLayer'
import { AppProps } from '../../../apps/AppProps'

class MenuPersonStore {
  people: PersonBit[] = []

  people$ = observeMany(PersonBitModel, {
    args: {
      take: 100,
    },
  }).subscribe(values => {
    this.people = values
  })
}

export function MenuPerson(props: AppProps & { menusStore: MenusStore }) {
  const store = useStore(MenuPersonStore, props)
  return (
    <Menu index={0} width={300} menusStore={props.menusStore}>
      {store.people.map(person => (
        <MenuItem key={person.email}>{person.name}</MenuItem>
      ))}
      <MenuItem icon="😓">Lorem Ipsum</MenuItem>
      <MenuItem icon="🤬">Lorem Ipsum</MenuItem>
      <MenuItem icon="👺">Lorem Ipsum</MenuItem>
      <MenuItem icon="🙀">Lorem Ipsum</MenuItem>
      <MenuItem icon="🥶">Lorem Ipsum</MenuItem>
      <MenuItem icon="🗣">Lorem Ipsum</MenuItem>
    </Menu>
  )
}
