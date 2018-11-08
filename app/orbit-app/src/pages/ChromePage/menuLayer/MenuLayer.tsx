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

export class MenusStore {
  lastMenuOpen = 2

  setLastOpen = index => {
    this.lastMenuOpen = index
  }
}

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
  const menusStore = useStore(MenusStore)
  const menuProps = {
    appStore,
    menusStore,
  }
  return (
    <StoreContext.Provider value={{ ...appProps, appStore }}>
      <Theme name="dark">
        <FullScreen>
          <MenuPerson
            id="0"
            view="index"
            title="People"
            type="people"
            {...appProps}
            {...menuProps}
          />
          <MenuTopic
            id="1"
            view="index"
            title="Topics"
            type="topics"
            {...appProps}
            {...menuProps}
          />
          <MenuList id="2" view="index" title="Lists" type="lists" {...appProps} {...menuProps} />
        </FullScreen>
      </Theme>
    </StoreContext.Provider>
  )
}
