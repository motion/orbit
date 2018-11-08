import * as React from 'react'
import { Menu } from './Menu'
import { AppProps } from '../../../apps/AppProps'
import { Searchable } from '../../../components/Searchable'
import { TopicsAppIndex } from '../../../apps/topics/TopicsAppIndex'
import { MenusStore } from './MenuLayer'

export function MenuTopic(props: AppProps & { menusStore: MenusStore }) {
  return (
    <Menu index={1} width={300} menusStore={props.menusStore}>
      <Searchable {...props}>
        <TopicsAppIndex {...props} />
      </Searchable>
    </Menu>
  )
}
