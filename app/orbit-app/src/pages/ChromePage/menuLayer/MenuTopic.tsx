import * as React from 'react'
import { Menu } from './Menu'
import { Searchable } from '../../../components/Searchable'
import { TopicsAppIndex } from '../../../apps/topics/TopicsAppIndex'
import { MenuAppProps } from './MenuLayer'

export function MenuTopic(props: MenuAppProps) {
  return (
    <Menu index={1} width={300} menusStore={props.menusStore}>
      <Searchable {...props}>
        <TopicsAppIndex {...props} />
      </Searchable>
    </Menu>
  )
}
