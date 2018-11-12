import * as React from 'react'
import { AppWrapper } from '../../views'
import { MenuLayer } from './menuLayer/MenuLayer'
import { Theme, FullScreen } from '@mcro/ui'
import { App } from '@mcro/stores'
import { useStore } from '@mcro/use-store'
import { StoreContext } from '@mcro/black'
import { SettingStore } from '../../stores/SettingStore'
import { SourcesStore } from '../../stores/SourcesStore'

class ChromePageStore {
  get theme() {
    return App.state.darkTheme ? 'dark' : 'light'
  }
}

export function ChromePage() {
  const store = useStore(ChromePageStore)
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  log(`ChromePage????`)
  return (
    <StoreContext.Provider value={{ settingStore, sourcesStore }}>
      <Theme name={store.theme}>
        <AppWrapper>
          <FullScreen>
            {/* <AppTray /> */}
            <MenuLayer />
          </FullScreen>
        </AppWrapper>
      </Theme>
    </StoreContext.Provider>
  )
}
