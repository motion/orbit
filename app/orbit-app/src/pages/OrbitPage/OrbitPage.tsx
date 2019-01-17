import * as React from 'react'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { AppWrapper } from '../../views'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SettingStore } from '../../stores/SettingStore'
import { SpaceStore } from '../../stores/SpaceStore'
import { Theme } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { App } from '@mcro/stores'
import OrbitOnboard from './OrbitOnboard'
import MainShortcutHandler from '../../components/shortcutHandlers/MainShortcutHandler'
import OrbitHeader from './OrbitHeader'
import OrbitPageContent from './OrbitPageContent'
import { observer } from 'mobx-react-lite'
import { gloss } from '@mcro/gloss'
import { invertLightness } from '@mcro/color'
import { StoreContext } from '../../contexts'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'

export default observer(() => {
  const theme = App.state.darkTheme ? 'dark' : 'light'
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const spaceStore = useStore(SpaceStore)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const orbitWindowStore = useStore(OrbitWindowStore, { queryStore })
  const activeApps = useActiveAppsSorted({ spaceStore })
  const paneManagerStore = useStore(PaneManagerStore, {
    panes: [
      ...activeApps.map(app => ({
        ...app,
        keyable: true,
      })),
      ...[
        { name: 'Settings', type: 'settings' },
        { name: 'Sources', type: 'sources' },
        { name: 'Onboard', type: 'onboard' },
      ].map((pane, id) => ({ ...pane, id: `app-${id}` })),
    ],
  })

  const stores = {
    settingStore,
    sourcesStore,
    orbitWindowStore,
    spaceStore,
    queryStore,
    paneManagerStore,
  }

  return (
    <StoreContext.Provider value={stores}>
      <MainShortcutHandler>
        <Theme name={theme}>
          <AppWrapper className={`theme-${theme} app-parent-bounds`}>
            <Chrome>
              <OrbitHeader />

              <InnerChrome>
                <OrbitPageContent />
              </InnerChrome>

              <OrbitOnboard />
            </Chrome>
          </AppWrapper>
        </Theme>
      </MainShortcutHandler>
    </StoreContext.Provider>
  )
})

const Chrome = gloss({
  flex: 1,
}).theme((_, theme) => ({
  background: invertLightness(theme.background, 0.1).alpha(0.75),
}))

const InnerChrome = gloss({
  flexFlow: 'row',
  flex: 1,
  overflow: 'hidden',
}).theme(() => ({
  boxShadow: [[0, 0, 40, [0, 0, 0, 0.05]]],
}))
