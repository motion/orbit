import * as React from 'react'
import { FullScreen, Theme } from '@mcro/ui'
import { MenuPerson } from './MenuPerson'
import { MenuTopic } from './MenuTopic'
import { MenuList } from './MenuList'
import { SettingStore } from '../../../stores/SettingStore'
import { SourcesStore } from '../../../stores/SourcesStore'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { useStore } from '@mcro/use-store'
import { AppStore } from '../../../apps/AppStore'
import { SelectionStore } from '../../../stores/SelectionStore'
import { StoreContext } from '../../../contexts'

export function MenuLayer() {
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const selectionStore = useStore(SelectionStore, { queryStore })
  const appProps = {
    settingStore,
    sourcesStore,
    queryStore,
    selectionStore,
  }
  const appStore = useStore(AppStore, appProps)
  return (
    <StoreContext.Provider value={{ ...appProps, appStore }}>
      <Theme name="dark">
        <FullScreen>
          <MenuPerson id="0" title="People" type="people" appStore={appStore} {...appProps} />
          <MenuTopic id="1" title="Topics" type="topics" appStore={appStore} {...appProps} />
          <MenuList id="2" title="Lists" type="lists" appStore={appStore} {...appProps} />
        </FullScreen>
      </Theme>
    </StoreContext.Provider>
  )
}
