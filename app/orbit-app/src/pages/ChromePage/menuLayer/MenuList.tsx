import * as React from 'react'
import { Menu } from './Menu'
import { AppProps } from '../../../apps/AppProps'
import { Searchable } from '../../../components/Searchable'
import { AppView } from '../../../apps/AppView'

export function MenuList(props: AppProps) {
  return (
    <Menu index={2} width={300}>
      {isOpen => (
        <Searchable {...props}>
          <AppView view="index" isActive={isOpen} {...props} />
        </Searchable>
      )}
    </Menu>
  )
}
