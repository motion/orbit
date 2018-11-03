import * as React from 'react'
import { FullScreen, Theme } from '@mcro/ui'
import { MenuPerson } from './MenuPerson'
import { MenuTopic } from './MenuTopic'
import { MenuList } from './MenuList'

export function MenuLayer() {
  return (
    <Theme name="dark">
      <FullScreen>
        <MenuPerson />
        <MenuTopic />
        <MenuList />
      </FullScreen>
    </Theme>
  )
}
