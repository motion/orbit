import { SpaceStore } from '@o/kit'
import { FullScreen, Theme } from '@o/ui'
import { useStore } from '@o/use-store'
import * as React from 'react'
import { StoreContext } from '../../contexts'
import { AppWrapper } from '../../views'
import Menu from './menuLayer/Menu'

export default function ChomePage() {
  const spaceStore = useStore(SpaceStore)
  return (
    <StoreContext.Provider value={{ spaceStore }}>
      <Theme name="dark">
        <AppWrapper className="app-wrapper">
          <FullScreen pointerEvents="none">
            <Menu />
          </FullScreen>
        </AppWrapper>
      </Theme>
    </StoreContext.Provider>
  )
}
