import * as React from 'react'
import { view, compose } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron } from '@mcro/stores'
import { logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { WEB_PREFERENCES } from '../constants'
import { BrowserWindow } from 'electron'

const log = logger('electron')
const Config = getGlobalConfig()

type Props = {
  id: number
}

class AppWindowStore {
  props: Props
  window: BrowserWindow = null

  get ignoreMouseEvents() {
    return true
  }

  get url() {
    return `${Config.urls.server}/app?id=${this.props.id}`
  }

  handleRef = ref => {
    this.window = ref.window
  }
}

const decorator = compose(
  view.attach({
    store: AppWindowStore,
  }),
  view.electron,
)

export const AppWindow = decorator(
  ({ store }: Props & { store: AppWindowStore }) => {
    log(`Rendering app window at url ${store.url}`)
    return (
      <Window
        alwaysOnTop
        ref={store.handleRef}
        ignoreMouseEvents={!Electron.hoverState.peekHovered}
        file={store.url}
        frame={false}
        hasShadow={false}
        // showDevTools={Electron.state.showDevTools.app}
        transparent
        background="#00000000"
        webPreferences={WEB_PREFERENCES}
        position={[0, 0]}
        size={Electron.state.screenSize}
      />
    )
  },
)
