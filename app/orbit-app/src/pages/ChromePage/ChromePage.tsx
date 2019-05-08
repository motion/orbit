import { FullScreen, Theme } from '@o/ui'
import * as React from 'react'

import { AppWrapper } from '../../views'
import Menu from './menuLayer/Menu'

export default function ChomePage() {
  return (
    <Theme name="dark">
      <AppWrapper className="app-wrapper">
        <FullScreen pointerEvents="none">
          <Menu />
        </FullScreen>
      </AppWrapper>
    </Theme>
  )
}
