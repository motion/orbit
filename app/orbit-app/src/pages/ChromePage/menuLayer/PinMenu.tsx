import * as React from 'react'
import { MenuItem } from './MenuItem'
import { Menu } from './Menu'

export function PinMenu() {
  return (
    <Menu id="Pin" width={300}>
      <MenuItem icon="😓">Lorem Ipsum</MenuItem>
      <MenuItem icon="🤬">Lorem Ipsum</MenuItem>
      <MenuItem icon="👺">Lorem Ipsum</MenuItem>
      <MenuItem icon="🙀">Lorem Ipsum</MenuItem>
      <MenuItem icon="🥶">Lorem Ipsum</MenuItem>
      <MenuItem icon="🗣">Lorem Ipsum</MenuItem>
    </Menu>
  )
}
