import * as React from 'react'
import { FullScreen, Theme } from '@mcro/ui'
import { PinMenu } from './PinMenu'
import { PersonMenu } from './PersonMenu'

export function MenuLayer() {
  return (
    <Theme name="dark">
      <FullScreen>
        <PinMenu />
        <PersonMenu />
      </FullScreen>
    </Theme>
  )
}
