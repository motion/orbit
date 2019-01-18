import { FullScreen, Theme } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import * as React from 'react'
import { StoreContext } from '../../contexts'
import { SettingStore } from '../../stores/SettingStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { SpaceStore } from '../../stores/SpaceStore'
import { AppWrapper } from '../../views'
import MenuLayer from './menuLayer/MenuLayer'

export default function ChomePage() {
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const spaceStore = useStore(SpaceStore)
  return (
    <StoreContext.Provider value={{ settingStore, sourcesStore, spaceStore }}>
      <Theme name="dark">
        <AppWrapper>
          <FullScreen>
            <MenuLayer />
          </FullScreen>
        </AppWrapper>
      </Theme>
    </StoreContext.Provider>
  )
}
