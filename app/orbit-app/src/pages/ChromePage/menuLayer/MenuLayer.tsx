import * as React from 'react'
import { FullScreen, Theme } from '@mcro/ui'
import { MenuPerson } from './MenuPerson'
import { MenuTopic } from './MenuTopic'
import { MenuList } from './MenuList'
import { SettingStore } from '../../../stores/SettingStore'
import { SourcesStore } from '../../../stores/SourcesStore'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { useStore } from '@mcro/use-store'
import { SelectionStore } from '../../../stores/SelectionStore'
import { StoreContext } from '../../../contexts'
import { getOpenMenuID, setTrayFocused } from './helpers'
import { App, Electron, Desktop } from '@mcro/stores'
import { react, ensure } from '@mcro/black'
import { AppActions } from '../../../actions/AppActions'
import { AppProps } from '../../../apps/AppProps'
import { AppStore } from '../../../apps/AppStore'

export type MenuAppProps = AppProps & { menusStore: MenusStore }

export class MenusStore {
  searchInput: HTMLInputElement = null
  lastMenuOpen = 2
  menuOpenID = react(getOpenMenuID, _ => _)
  lastMenuOpenID = react(() => App.state.trayState.menuState, _ => _, { delayValue: true })

  setLastOpen = index => {
    this.lastMenuOpen = index
  }

  get changingMenu() {
    return this.menuOpenID !== this.lastMenuOpenID
  }

  get anyMenuOpen() {
    return this.menuOpenID !== false
  }

  closePeekOnChangeMenu = react(
    () => this.changingMenu,
    isChanging => {
      ensure('isChanging', isChanging)
      AppActions.clearPeek()
    },
  )

  areMenusFocused = react(
    () => this.anyMenuOpen,
    async (anyMenuOpen, { sleep, whenChanged }) => {
      if (anyMenuOpen) {
        if (Desktop.isHoldingOption) {
          window['electronRequire']('electron').remote.app.show()
          // wait for pin to focus the menu
          await whenChanged(() => Electron.state.pinKey.at)
          console.log('GOT A PIN KEY', Electron.state.pinKey.name)
        }
        setTrayFocused(true)
        return true
      } else {
        await sleep(200)
        setTrayFocused(false)
        return false
      }
    },
    {
      deferFirstRun: true,
    },
  )

  handleAppViewFocus = react(
    () => App.showingPeek,
    showingPeek => {
      ensure('showingPeek', showingPeek)
      setTrayFocused(true)
    },
  )

  handleSearchInput = (ref: HTMLInputElement) => {
    console.log('got input ref', ref)
    this.searchInput = ref
  }
}

export function MenuLayer() {
  const settingStore = useStore(SettingStore)
  const sourcesStore = useStore(SourcesStore)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const selectionStore = useStore(SelectionStore, { queryStore })
  const menusStore = useStore(MenusStore)
  const storeProps = {
    settingStore,
    sourcesStore,
    queryStore,
    selectionStore,
    menusStore,
  }
  const appStore = useStore(AppStore, storeProps)
  return (
    <StoreContext.Provider value={{ ...storeProps, appStore }}>
      <Theme name="dark">
        <FullScreen>
          <MenuPerson
            id="0"
            view="index"
            title="People"
            type="people"
            {...storeProps}
            appStore={appStore}
          />
          <MenuTopic
            id="1"
            view="index"
            title="Topics"
            type="topics"
            {...storeProps}
            appStore={appStore}
          />
          <MenuList
            id="2"
            view="index"
            title="Lists"
            type="lists"
            {...storeProps}
            appStore={appStore}
          />
        </FullScreen>
      </Theme>
    </StoreContext.Provider>
  )
}
