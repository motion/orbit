import { ProvideStores } from '@o/kit'
import { FullScreen, Theme } from '@o/ui'
import * as React from 'react'

import { Stores } from '../../om/stores'
import { AppWrapper } from '../../views'
import { Menu } from './Menu'

export default function ChromePage() {
  return (
    <ProvideStores stores={Stores}>
      <Theme name="dark">
        <AppWrapper className="app-wrapper">
          <FullScreen pointerEvents="none">
            <React.Suspense fallback={null}>
              <Menu />
            </React.Suspense>
          </FullScreen>
        </AppWrapper>
      </Theme>
    </ProvideStores>
  )
}
