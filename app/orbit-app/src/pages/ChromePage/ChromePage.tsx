import { SettingStore, SourcesStore, SpaceStore } from '@mcro/kit'
import { FullScreen, Theme } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import * as React from 'react'
import { StoreContext } from '../../contexts'
import { AppWrapper } from '../../views'
import Menu from './menuLayer/Menu'

export default function ChomePage() {
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const spaceStore = useStore(SpaceStore)
  return (
    <StoreContext.Provider value={{ settingStore, sourcesStore, spaceStore }}>
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
