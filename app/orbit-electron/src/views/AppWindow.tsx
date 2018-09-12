import * as React from 'react'
import { view, compose, react, ensure } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron, Desktop, App } from '@mcro/stores'
import { Logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { WEB_PREFERENCES } from '../constants'
import { BrowserWindow } from 'electron'
import { ElectronStore } from '../stores/ElectronStore'

const log = new Logger('electron')
const Config = getGlobalConfig()

type Props = {
  id: number
  isPeek: boolean
  electronStore: ElectronStore
}

class AppWindowStore {
  props: Props
  window: BrowserWindow = null
  off: any
  position = [1, 1]

  didMount() {
    this.props.electronStore.apps.add(this)
    setTimeout(() => {
      this.position = [0, 0]
    })
  }

  willUnmount() {
    // because weird stuff..
    this.window.close()
    this.props.electronStore.apps.delete(this)
    this.off()
  }

  get ignoreMouseEvents() {
    return true
  }

  get url() {
    return `${Config.urls.server}/app?id=${this.props.id}`
  }

  // looks at desktop appFocusState and then controls electron focus
  handleAppState = react(
    () => Desktop.state.appFocusState[this.props.id],
    focusState => {
      ensure('open', !!focusState)
      if (focusState.focused) {
        this.window.focus()
      }
    }
  )

  moveToNewSpace = react(
    () => Desktop.state.movedToNewSpace,
    async (moved, { sleep, when }) => {
      ensure('did move', !!moved)
      ensure('has window', !!this.window)
      // wait for move to finish
      await sleep(420)
      // wait for showing
      await when(() => App.orbitState.docked)
      this.window.setVisibleOnAllWorkspaces(true) // put the window on all screens
      this.window.focus() // focus the window up front on the active screen
      this.window.setVisibleOnAllWorkspaces(false) // disable all screen behavior
    },
  )

  handleRef = ref => {
    if (ref) {
      this.window = ref.window
      if (this.props.isPeek) {
        // set it above the OrbitWindow
        this.window.setAlwaysOnTop(true, 'floating', 2)
        this.window.setVisibleOnAllWorkspaces(true)
        this.window.setFullScreenable(false)
      }
    }
  }

  handleFocus = () => {
    console.log('!! app focus', this.props.id)
    Electron.setState({ focusedAppId: this.props.id })
  }
}

const decorator = compose(
  view.attach('electronStore'),
  view.attach({
    store: AppWindowStore,
  }),
  view.electron,
)

export const AppWindow = decorator(({ id, store, isPeek }: Props & { store: AppWindowStore }) => {
  log.info(`Rendering app window ${id} at url ${store.url}`)
  return (
    <Window
      alwaysOnTop={isPeek}
      show
      ref={store.handleRef}
      ignoreMouseEvents={!Electron.hoverState.peekHovered[id]}
      focusable={isPeek}
      file={store.url}
      frame={false}
      hasShadow={false}
      showDevTools={Electron.state.showDevTools[`${id}`]}
      transparent
      background="#00000000"
      webPreferences={WEB_PREFERENCES}
      position={store.position}
      size={Electron.state.screenSize}
      onFocus={store.handleFocus}
    />
  )
})
