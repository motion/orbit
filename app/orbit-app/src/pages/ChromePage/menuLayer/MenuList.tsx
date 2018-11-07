import * as React from 'react'
import { Menu } from './Menu'
import { AppProps } from '../../../apps/AppProps'
import { Searchable } from '../../../components/Searchable'
import { App } from '../../../apps/App'

export function MenuList(props: AppProps) {
  return (
    <Menu index={2} width={300}>
      {isOpen => (
        <Searchable {...props}>
          <App isActive={isOpen} {...props} />
        </Searchable>
      )}
    </Menu>
  )
}
