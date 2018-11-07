import * as React from 'react'
import { Menu } from './Menu'
import { AppProps } from '../../../apps/AppProps'
import { ListsApp } from '../../../apps/lists/ListsApp'
import { Searchable } from '../../../components/Searchable'

export function MenuList(props: AppProps) {
  return (
    <Menu index={2} width={300}>
      <Searchable {...props}>
        <ListsApp {...props} />
      </Searchable>
    </Menu>
  )
}
