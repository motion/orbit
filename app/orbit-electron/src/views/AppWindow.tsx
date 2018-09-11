import * as React from 'react'
import { view, compose, react, ensure } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron, Desktop, App } from '@mcro/stores'
import { logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { WEB_PREFERENCES } from '../constants'
import { BrowserWindow } from 'electron'
import { ElectronStore } from '../stores/ElectronStore'

const log = logger('electron')
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

    // listen for events
    this.off = Electron.onMessage(Electron.messages.APP_STATE, val => {
      const { id, action } = JSON.parse(val)
      if (id === this.props.id) {
        console.log('ELECTRON GOT ACTION', action)
        switch (action) {
          case 'focus':
            this.window.focus()
        }
      }
    })
  }

  willUnmount() {
    this.props.electronStore.apps.delete(this)
    this.off()
  }

  get ignoreMouseEvents() {
    return true
  }

  get url() {
    return `${Config.urls.server}/app?id=${this.props.id}`
  }

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
}

const decorator = compose(
  view.attach('electronStore'),
  view.attach({
    store: AppWindowStore,
  }),
  view.electron,
)

export const AppWindow = decorator(
  ({ id, store, isPeek }: Props & { store: AppWindowStore }) => {
    log(`Rendering app window ${id} at url ${store.url}`)
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
        // showDevTools={Electron.state.showDevTools.app}
        transparent
        background="#00000000"
        webPreferences={WEB_PREFERENCES}
        position={store.position}
        size={Electron.state.screenSize}
      />
    )
  },
)
