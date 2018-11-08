import * as React from 'react'
import { Menu } from './Menu'
import { Searchable } from '../../../components/Searchable'
import { AppView } from '../../../apps/AppView'
import { MenuAppProps } from './MenuLayer'

export function MenuList(props: MenuAppProps) {
  return (
    <Menu index={2} width={300} menusStore={props.menusStore}>
      {isOpen => (
        <Searchable
          inputProps={{
            forwardRef: props.menusStore.handleSearchInput,
            onChange: props.appStore.queryStore.onChangeQuery,
          }}
        >
          <AppView view="index" isActive={isOpen} {...props} />
        </Searchable>
      )}
    </Menu>
  )
}
