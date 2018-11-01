import * as React from 'react'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'
import { Desktop, App } from '@mcro/stores'
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

  get trayBounds() {
    return Desktop.state.operatingSystem.trayBounds
  }

  showMenu = react(() => App.state.trayState, state => state.trayEvent === 'TrayHoverOrbit')

  get menuCenter() {
    return (this.trayBounds[0] + this.trayBounds[1]) / 2
  }
}

export function PersonMenu(props) {
  const store = useStore(PersonMenuStore, props)
  const width = 300
  const dockOffset = 28
  return (
    <Menu open={store.showMenu} width={width} left={store.menuCenter + dockOffset}>
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
