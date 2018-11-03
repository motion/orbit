import * as React from 'react'
import { useStore } from '@mcro/use-store'
import { MenuItem } from './MenuItem'
import { Menu } from './Menu'

class MenuTopicStore {
  title = 'Topics'
}

export function MenuTopic(props) {
  const store = useStore(MenuTopicStore, props)
  return (
    <Menu index={1} width={300}>
      {store.title}
      <MenuItem icon="😓">Lorem Ipsum</MenuItem>
      <MenuItem icon="🤬">Lorem Ipsum</MenuItem>
      <MenuItem icon="👺">Lorem Ipsum</MenuItem>
      <MenuItem icon="🙀">Lorem Ipsum</MenuItem>
      <MenuItem icon="🥶">Lorem Ipsum</MenuItem>
      <MenuItem icon="🗣">Lorem Ipsum</MenuItem>
    </Menu>
  )
}
