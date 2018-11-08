import * as React from 'react'
import { FullScreen, Theme } from '@mcro/ui'
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
import { MenuApp } from './MenuApp'
import { AppType } from '../../../apps/apps'

export type MenuAppProps = AppProps & { menusStore: MenusStore; index: number }

export class MenusStore {
  searchInput: { [key: number]: HTMLInputElement } = {}
  lastMenuOpen = 2
  menuOpenID = react(getOpenMenuID, _ => _)
  lastMenuOpenID = react(() => this.menuOpenID, _ => _, { delayValue: true })

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

  handleSearchInput = (index: number) => (ref: HTMLInputElement) => {
    this.searchInput[index] = ref
  }

  focusSearchInputOnFocus = react(
    () => [this.areMenusFocused, this.menuOpenID],
    ([focused, id]) => {
      ensure('focused', focused)
      if (typeof id === 'number') {
        const inputRef = this.searchInput[id]
        ensure('inputRef', !!inputRef)
        inputRef.focus()
      }
    },
  )
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
  return (
    <StoreContext.Provider value={storeProps}>
      <Theme name="dark">
        <FullScreen>
          {(['people', 'topics', 'lists'] as AppType[]).map((app, index) => (
            <MenuApp
              key={app}
              id={`${index}`}
              view="index"
              index={index}
              title={app}
              type={app}
              menusStore={menusStore}
              isActive={menusStore.menuOpenID === index}
            />
          ))}
        </FullScreen>
      </Theme>
    </StoreContext.Provider>
  )
}
