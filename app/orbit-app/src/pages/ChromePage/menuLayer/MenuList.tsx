import * as React from 'react'
import { Menu } from './Menu'
import { AppProps } from '../../../apps/AppProps'
import { ListsApp } from '../../../apps/lists/ListsApp'
import { Searchable } from '../../../components/Searchable'

export function MenuList(props: AppProps) {
  console.log('props', props)
  return (
    <Menu index={2} width={300}>
      <Searchable {...props}>
        <ListsApp width={300} {...props} />
      </Searchable>
      {/* <MenuItem icon="😓">Lorem Ipsum</MenuItem>
      <MenuItem icon="🤬">Lorem Ipsum</MenuItem>
      <MenuItem icon="👺">Lorem Ipsum</MenuItem>
      <MenuItem icon="🙀">Lorem Ipsum</MenuItem>
      <MenuItem icon="🥶">Lorem Ipsum</MenuItem>
      <MenuItem icon="🗣">Lorem Ipsum</MenuItem> */}
    </Menu>
  )
}
