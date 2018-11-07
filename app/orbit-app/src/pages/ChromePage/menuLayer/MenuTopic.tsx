import * as React from 'react'
import { Menu } from './Menu'
import { AppProps } from '../../../apps/AppProps'
import { Searchable } from '../../../components/Searchable'
import { TopicsApp } from '../../../apps/topics/TopicsApp'

export function MenuTopic(props: AppProps) {
  return (
    <Menu index={1} width={300}>
      <Searchable {...props}>
        <TopicsApp {...props} />
      </Searchable>
    </Menu>
  )
}
