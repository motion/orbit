import * as React from 'react'
import { view, compose } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron } from '@mcro/stores'
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
  position = [1, 1]

  didMount() {
    this.props.electronStore.apps.add(this)
    setTimeout(() => {
      this.position = [0, 0]
    })
  }

  willUnmount() {
    this.props.electronStore.apps.delete(this)
  }

  get ignoreMouseEvents() {
    return true
  }

  get url() {
    return `${Config.urls.server}/app?id=${this.props.id}`
  }

  handleRef = ref => {
    if (ref) {
      this.window = ref.window
      if (this.props.isPeek) {
        // set it above the OrbitWindow
        this.window.setAlwaysOnTop(true, 'floating', 10)
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
  ({ id, store }: Props & { store: AppWindowStore }) => {
    log(`Rendering app window at url ${store.url}`)
    return (
      <Window
        alwaysOnTop
        show
        ref={store.handleRef}
        ignoreMouseEvents={!Electron.hoverState.peekHovered[id]}
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
