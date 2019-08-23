import { ProvideStores } from '@o/kit'
import { FullScreen, Theme } from '@o/ui'
import * as React from 'react'

import { Stores } from '../../om/stores'
import { AppWrapper } from '../../views'
import { Menu } from './Menu'

export function ChomePage() {
  return (
    <ProvideStores stores={Stores}>
      <Theme name="dark">
        <AppWrapper className="app-wrapper">
          <FullScreen pointerEvents="none">
            <Menu />
          </FullScreen>
        </AppWrapper>
      </Theme>
    </ProvideStores>
  )
}
