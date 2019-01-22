import { ensure, react } from '@mcro/black'
import { invertLightness } from '@mcro/color'
import { gloss } from '@mcro/gloss'
import { AppConfig, AppType } from '@mcro/models'
import { App } from '@mcro/stores'
import { Theme } from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import { isEqual, memoize } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppStore } from '../../apps/AppStore'
import MainShortcutHandler from '../../components/shortcutHandlers/MainShortcutHandler'
import { StoreContext } from '../../contexts'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SettingStore } from '../../stores/SettingStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { SpaceStore } from '../../stores/SpaceStore'
import { AppWrapper } from '../../views'
import { OrbitHandleSelect } from '../../views/Lists/OrbitList'
import { MergeContext } from '../../views/MergeContext'
import OrbitHeader from './OrbitHeader'
import OrbitPageContent from './OrbitPageContent'

export class OrbitStore {
  stores = useHook(useStoresSafe)
  lastSelectAt = Date.now()
  nextItem = { index: -1, appConfig: null }

  get activePane() {
    return this.stores.paneManagerStore.activePane
  }

  activeConfig: { [key: string]: AppConfig } = {
    search: { id: '', type: AppType.search, title: '' },
  }

  handleSelectItem: OrbitHandleSelect = (index, appConfig) => {
    this.nextItem = { index, appConfig }
  }

  updateSelectedItem = react(
    () => this.nextItem,
    async ({ appConfig }, { sleep }) => {
      const last = this.lastSelectAt
      this.lastSelectAt = Date.now()

      // if we are quickly selecting (keyboard nav) sleep it so we dont load every item as we go
      if (Date.now() - last < 50) {
        await sleep(50)
      }

      ensure('app config', !!appConfig)

      const paneType = this.activePane.type
      if (!isEqual(this.activeConfig[paneType], appConfig)) {
        this.activeConfig = {
          ...this.activeConfig,
          [paneType]: appConfig,
        }
      }
    },
  )

  appStores: { [key: string]: AppStore<any> } = {}

  setAppStore = memoize((id: number) => (store: AppStore<any>) => {
    if (this.appStores[id] !== store) {
      this.appStores = {
        ...this.appStores,
        [id]: store,
      }
    }
  })
}

export default observer(function OrbitPage() {
  return (
    <OrbitPageProvideStores>
      <OrbitPageInner />
    </OrbitPageProvideStores>
  )
})

const OrbitPageInner = observer(function OrbitPageInner() {
  const orbitStore = useStore(OrbitStore)
  const theme = App.state.darkTheme ? 'dark' : 'light'
  return (
    <MergeContext Context={StoreContext} value={{ orbitStore }}>
      <MainShortcutHandler>
        <Theme name={theme}>
          <AppWrapper className={`theme-${theme} app-parent-bounds`}>
            <Chrome>
              <OrbitHeader />

              <InnerChrome>
                <OrbitPageContent />
              </InnerChrome>
            </Chrome>
          </AppWrapper>
        </Theme>
      </MainShortcutHandler>
    </MergeContext>
  )
})

function OrbitPageProvideStores(props: { children: any }) {
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const spaceStore = useStore(SpaceStore)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const orbitWindowStore = useStore(OrbitWindowStore, { queryStore })
  const activeApps = useActiveAppsSorted()
  const paneManagerStore = useStore(PaneManagerStore, {
    panes: [
      ...activeApps.map(app => ({
        ...app,
        keyable: true,
      })),
      ...[
        { name: 'Settings', type: 'settings' },
        { name: 'Apps', type: 'apps' },
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

  return <StoreContext.Provider value={stores}>{props.children}</StoreContext.Provider>
}

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
  boxShadow: [[0, 0, 80, [0, 0, 0, 0.045]]],
}))
