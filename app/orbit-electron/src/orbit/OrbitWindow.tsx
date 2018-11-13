import * as React from 'react'
import { view, react, ensure, attach, provide } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron, Desktop, App } from '@mcro/stores'
import { ElectronStore } from '../stores/ElectronStore'
import { Logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { Menu, BrowserWindow, app } from 'electron'
import root from 'global'

const log = new Logger('electron')
const Config = getGlobalConfig()

type Props = {
  store?: OrbitWindowStore
  electronStore?: ElectronStore
}

class OrbitWindowStore {
  props: Props
  orbitRef: BrowserWindow = null
  disposeShow = null
  alwaysOnTop = true

  didMount() {
    // temp bugfix
    root['OrbitWindowStore'] = this
  }

  handleRef = ref => {
    if (!ref) {
      return
    }
    this.orbitRef = ref.window
  }

  handleOrbitSpaceMove = react(
    () => Desktop.state.movedToNewSpace,
    async (moved, { sleep, when }) => {
      ensure('did move', !!moved)
      ensure('window', !!this.orbitRef)
      // wait for move to finish
      await sleep(150)
      // wait for showing
      await when(() => App.orbitState.docked)
      this.showOnNewSpace()
    },
  )

  handleOrbitShouldFocus = react(
    () => Desktop.orbitFocusState.focused,
    async (focused, { sleep }) => {
      console.log('\n\n\n\n LETS FOCUS ORBIT \n\n\n\n\n')
      if (focused) {
        this.handleFocus()
        await sleep()
        this.orbitRef.show()
        this.orbitRef.focus()
        // bring dev tools to front in dev mode
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            app.show()
          }, 16)
        }
      } else {
        // nothing for now on blur
      }
    },
  )

  handleOrbitDocked = react(
    () => App.orbitState.docked,
    docked => {
      if (!docked) {
        Menu.sendActionToFirstResponder('hide:')
      } else {
        this.orbitRef.show()
      }
    },
  )

  showOnNewSpace() {
    console.log('Show on new space...')
    this.orbitRef.setVisibleOnAllWorkspaces(true) // put the window on all screens
    this.orbitRef.focus() // focus the window up front on the active screen
    this.orbitRef.setVisibleOnAllWorkspaces(false) // disable all screen behavior
  }

  handleFocus = () => {
    // avoid sending two show commands in a row in some cases
    const lm = Electron.bridge.lastMessage
    if (lm && lm.message === App.messages.SHOW) {
      console.log('last message', lm, Date.now() - lm.at)
      if (Date.now() - lm.at < 300) {
        console.log('avoid sending double "show" event when already opened')
        return
      }
    }
    Electron.sendMessage(App, App.messages.SHOW)
  }

  // just set this here for devtools opening,
  // we are doing weird stuff with focus
  handleElectronFocus = () => {
    Electron.setState({ focusedAppId: 'app' })
  }
}

@attach('electronStore')
@provide({
  store: OrbitWindowStore,
})
@view
export class OrbitWindow extends React.Component<Props> {
  render() {
    const { store, electronStore } = this.props
    const url = Config.urls.server
    log.info(`render OrbitWindow ${url} hovered? ${Desktop.hoverState.orbitHovered}`)
    return (
      <Window
        alwaysOnTop={[store.alwaysOnTop, 'floating', 1]}
        ignoreMouseEvents={!Desktop.hoverState.orbitHovered}
        ref={store.handleRef}
        file={url}
        focus={false}
        position={[0, 0]}
        size={Electron.state.screenSize.slice()}
        show={electronStore.show ? App.orbitState.docked : false}
        opacity={electronStore.show === 1 ? 0 : 1}
        frame={false}
        hasShadow={false}
        onFocus={store.handleElectronFocus}
        showDevTools={Electron.state.showDevTools.app}
        transparent
        background="#00000000"
        webPreferences={{
          nativeWindowOpen: true,
          experimentalFeatures: true,
          transparentVisuals: true,
          allowRunningInsecureContent: false,
          webSecurity: false,
          // plugins: true,
          // scrollBounce: true,
          // offscreen: true,
        }}
      />
    )
  }
}
