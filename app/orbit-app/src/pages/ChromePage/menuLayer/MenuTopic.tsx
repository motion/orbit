import * as React from 'react'
import { Menu } from './Menu'
import { AppProps } from '../../../apps/AppProps'
import { Searchable } from '../../../components/Searchable'
import { TopicsAppIndex } from '../../../apps/topics/TopicsAppIndex'

export function MenuTopic(props: AppProps) {
  return (
    <Menu index={1} width={300}>
      <Searchable {...props}>
        <TopicsAppIndex {...props} />
      </Searchable>
    </Menu>
  )
}
