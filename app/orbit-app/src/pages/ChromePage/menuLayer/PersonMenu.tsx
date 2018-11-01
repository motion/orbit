import * as React from 'react'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'
import { Desktop, App } from '@mcro/stores'
import { View } from '@mcro/ui'
import { MenuItem } from './MenuItem'
import { observeMany } from '@mcro/model-bridge'
import { PersonBitModel, PersonBit } from '@mcro/models'

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
  const width = 250
  return (
    <View
      width={width}
      maxHeight={300}
      overflowX="hidden"
      overflowY="auto"
      background="#fff"
      borderBottomRadius={10}
      boxShadow={[[0, 0, 60, [0, 0, 0, 0.5]]]}
      position="absolute"
      top={0}
      left={store.menuCenter - width / 2}
      opacity={store.showMenu ? 1 : 0}
      transform={{
        x: store.showMenu ? 0 : -10,
      }}
      transition="all ease 200ms"
    >
      {store.people.map(person => (
        <MenuItem key={person.email}>{person.name}</MenuItem>
      ))}
      <MenuItem icon="😓">Lorem Ipsum</MenuItem>
      <MenuItem icon="🤬">Lorem Ipsum</MenuItem>
      <MenuItem icon="👺">Lorem Ipsum</MenuItem>
      <MenuItem icon="🙀">Lorem Ipsum</MenuItem>
      <MenuItem icon="🥶">Lorem Ipsum</MenuItem>
      <MenuItem icon="🗣">Lorem Ipsum</MenuItem>
    </View>
  )
}
