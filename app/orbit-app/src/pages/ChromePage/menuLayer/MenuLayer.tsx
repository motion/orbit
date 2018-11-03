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

export function MenuLayer(props) {
  const settingStore = useStore(SettingStore, props)
  const sourcesStore = useStore(SourcesStore, props)
  const queryStore = useStore(QueryStore, props)
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
          <MenuPerson title="People" type="people" appStore={appStore} {...appProps} />
          <MenuTopic title="Topics" type="topics" appStore={appStore} {...appProps} />
          <MenuList title="Lists" type="lists" appStore={appStore} {...appProps} />
        </FullScreen>
      </Theme>
    </StoreContext.Provider>
  )
}
