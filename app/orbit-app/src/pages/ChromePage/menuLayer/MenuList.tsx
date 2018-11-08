import * as React from 'react'
import { Menu } from './Menu'
import { AppProps } from '../../../apps/AppProps'
import { Searchable } from '../../../components/Searchable'
import { AppView } from '../../../apps/AppView'
import { MenusStore } from './MenuLayer'

export function MenuList(props: AppProps & { menusStore: MenusStore }) {
  return (
    <Menu index={2} width={300} menusStore={props.menusStore}>
      {isOpen => (
        <Searchable {...props}>
          <AppView view="index" isActive={isOpen} {...props} />
        </Searchable>
      )}
    </Menu>
  )
}
