import * as React from 'react'
import { AppWrapper } from '../../views'
import { MenuLayer } from './menuLayer/MenuLayer'
import { Theme } from '@mcro/ui'
import { App } from '@mcro/stores'
import { TrayActions } from '../../actions/Actions'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'

const getAnyMenuOpen = () => {
  const menuState = App.state.trayState.menuState
  return Object.keys(menuState).reduce((a, key) => a || menuState[key].open, false)
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

  sendTrayEvent = (key, value) => {
    App.setState({
      trayState: {
        trayEvent: key,
        trayEventAt: value,
      },
    })
  }

  unFocusOnMenusClosed = react(
    () => getAnyMenuOpen() || !!App.showingPeek,
    async (anyMenuOpen, { sleep }) => {
      console.log('anyMenuOpen', anyMenuOpen)
      if (anyMenuOpen) {
        setTrayFocused(true)
      } else {
        await sleep(200)
        setTrayFocused(false)
      }
    },
  )
}

export function ChromePage() {
  const store = useStore(ChromePageStore)
  React.useEffect(() => {
    return App.onMessage(App.messages.TRAY_EVENT, async (key: keyof TrayActions) => {
      switch (key) {
        case 'TrayToggleOrbit':
          App.setOrbitState({ docked: !App.state.orbitState.docked })
          break
        case 'TrayHover0':
        case 'TrayHover1':
        case 'TrayHover2':
        case 'TrayHoverOrbit':
          store.sendTrayEvent(key, Date.now())
          break
        case 'TrayHoverOut':
          store.sendTrayEvent(key, Date.now())
          break
      }
    })
  }, [])

  return (
    <Theme name={store.theme}>
      <AppWrapper>
        <MenuLayer />
      </AppWrapper>
    </Theme>
  )
}
