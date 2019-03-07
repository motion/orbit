import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { SendClientDataCommand } from '@o/models'
import { Window } from '@o/reactron'
import { App, Desktop, Electron } from '@o/stores'
import { ensure, react, useStore } from '@o/use-store'
import { BrowserWindow } from 'electron'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { WEB_PREFERENCES } from '../constants'
import { Mediator } from '../mediator'

const log = new Logger('electron')
const Config = getGlobalConfig()

type Props = {
  id: number
  isPeek: boolean
}

class AppWindowStore {
  props: Props
  window: BrowserWindow = null
  position = [1, 1]
  closed = false

  setPos = react(
    () => 1,
    async (_, { sleep }) => {
      await sleep(100)
      this.position = [0, 0]
    },
  )

  willUnmount() {
    // We have to close manually because this is inside a normal window
    // so we are switching renderers technically which is real weird
    // and react reconciler api surface doesnt support mixed renderers...
    this.closeApp()
  }

  // looks at desktop appFocusState and then controls electron focus
  handleAppState = react(
    () => Desktop.state.appFocusState[this.props.id],
    focusState => {
      ensure('open', !!focusState)
      if (focusState.focused) {
        this.window.focus()
      }
    },
  )

  moveToNewSpace = react(
    () => Desktop.state.movedToNewSpace,
    async (moved, { sleep, when }) => {
      ensure('did move', !!moved)
      ensure('window', !!this.window)
      // wait for move to finish
      await sleep(400)
      // wait for showing
      await when(() => App.orbitState.docked)
      this.bringAppAboveOrbitWindow()
    },
  )

  handleRef = ref => {
    if (ref) {
      this.window = ref.window
      if (this.props.isPeek) {
        this.bringAppAboveOrbitWindow()
      }
    }
  }

  bringAppAboveOrbitWindow = () => {
    console.log('Move App above Orbit Window...')
    // set it above the OrbitWindow and ChromeWindow
    this.window.setAlwaysOnTop(true, 'floating', 3)
    this.window.setVisibleOnAllWorkspaces(true)
    this.window.setFullScreenable(false)
  }

  handleFocus = () => {
    console.log('!! app focus', this.props.id)
    Electron.setState({ focusedAppId: this.props.id })
  }

  handleClose = () => {
    if (this.closed) return
    Mediator.command(SendClientDataCommand, {
      name: 'CLOSE_APP',
      value: this.props.id,
    })
    this.closeApp()
  }

  private closeApp() {
    if (this.closed) {
      return
    }
    this.closed = true
    this.window.close()
  }
}

export default observer(function AppWindow(props: Props) {
  const store = useStore(AppWindowStore, props)
  const { id, isPeek } = props
  const ignoreMouseEvents = !Desktop.hoverState.appHovered[id]
  const url = `${Config.urls.server}/app?peekId=${this.props.id}`

  log.info(`Rendering app window ${id} at url ${url} ignore mouse? ${ignoreMouseEvents}`)

  return (
    <Window
      alwaysOnTop={isPeek}
      show={store.position[0] === 1 ? false : true}
      focus={false}
      ref={store.handleRef}
      ignoreMouseEvents={ignoreMouseEvents}
      focusable={isPeek}
      file={url}
      frame={false}
      hasShadow={false}
      showDevTools={Electron.state.showDevTools[`${id}`] || false}
      transparent
      background="#00000000"
      webPreferences={WEB_PREFERENCES}
      position={store.position.slice()}
      size={Electron.state.screenSize.slice()}
      onFocus={store.handleFocus}
      onClose={store.handleClose}
    />
  )
})
