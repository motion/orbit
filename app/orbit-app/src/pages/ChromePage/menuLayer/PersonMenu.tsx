import * as React from 'react'
import { useStore } from '@mcro/use-store'
import { MenuItem } from './MenuItem'
import { observeMany } from '@mcro/model-bridge'
import { PersonBitModel, PersonBit } from '@mcro/models'
import { Menu } from './Menu'

class PersonMenuStore {
  people: PersonBit[] = []

  people$ = observeMany(PersonBitModel, {
    args: {
      take: 100,
    },
  }).subscribe(values => {
    this.people = values
  })
}

export function PersonMenu(props) {
  const store = useStore(PersonMenuStore, props)
  return (
    <Menu id="Pin" width={300} offsetX={28}>
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
