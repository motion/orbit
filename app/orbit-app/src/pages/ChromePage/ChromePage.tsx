import * as React from 'react'
import { AppWrapper } from '../../views'
import MenuLayer from './menuLayer/MenuLayer'
import { Theme, FullScreen } from '@mcro/ui'
import { App } from '@mcro/stores'
import { useStore } from '@mcro/use-store'
import { SettingStore } from '../../stores/SettingStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { SpaceStore } from '../../stores/SpaceStore'
import { observer } from 'mobx-react-lite'
import { AppTray } from './appTray/AppTray'
import { StoreContext } from '../../contexts'

class ChromePageStore {
  get theme() {
    return App.state.darkTheme ? 'dark' : 'light'
  }
}

export default observer(() => {
  const store = useStore(ChromePageStore)
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const spaceStore = useStore(SpaceStore)
  return (
    <StoreContext.Provider value={{ settingStore, sourcesStore, spaceStore }}>
      <Theme name={store.theme}>
        <AppWrapper>
          <FullScreen>
            <AppTray />
            <MenuLayer />
          </FullScreen>
        </AppWrapper>
      </Theme>
    </StoreContext.Provider>
  )
})
