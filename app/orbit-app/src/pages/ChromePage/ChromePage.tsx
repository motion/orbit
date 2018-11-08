import * as React from 'react'
import { AppWrapper } from '../../views'
import { MenuLayer } from './menuLayer/MenuLayer'
import { Theme } from '@mcro/ui'
import { App, Electron, Desktop } from '@mcro/stores'
import { useStore } from '@mcro/use-store'
import { react, ensure } from '@mcro/black'
import { AppActions } from '../../actions/AppActions'

const getOpenMenuID = () => {
  const menuState = App.state.trayState.menuState
  for (const key in menuState) {
    if (menuState[key].open) {
      return menuState[key].id
    }
  }
  return false
}

// will focus or return focus to previous app
const setTrayFocused = (show = true) => {
  const req = window['electronRequire']
  if (!req) {
    console.log('not in electron')
    return
  }
  if (show) {
    req('electron').remote.app.focus()
  } else {
    req('electron').remote.Menu.sendActionToFirstResponder('hide:')
  }
}

class ChromePageStore {
  get theme() {
    return App.state.darkTheme ? 'clearDark' : 'clearLight'
  }

  menuOpenID = react(getOpenMenuID, _ => _)
  lastMenuOpenID = react(() => App.state.trayState.menuState, _ => _, { delayValue: true })

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

  handleMenuFocus = react(
    () => this.anyMenuOpen,
    async (anyMenuOpen, { sleep, whenChanged }) => {
      if (anyMenuOpen) {
        if (Desktop.isHoldingOption) {
          // wait for pin to focus the menu
          await whenChanged(() => Electron.state.pinKey)
        }
        setTrayFocused(true)
      } else {
        await sleep(200)
        setTrayFocused(false)
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
}

export function ChromePage() {
  const store = useStore(ChromePageStore)

  return (
    <Theme name={store.theme}>
      <AppWrapper>
        <MenuLayer />
      </AppWrapper>
    </Theme>
  )
}
