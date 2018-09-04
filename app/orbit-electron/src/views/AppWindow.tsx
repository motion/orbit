import * as React from 'react'
import { view, compose } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron } from '@mcro/stores'
import { logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { WEB_PREFERENCES } from '../constants'

const log = logger('electron')
const Config = getGlobalConfig()

class AppWindowStore {
  get ignoreMouseEvents() {
    return true
  }

  get url() {
    return Config.urls.server
  }
}

const decorator = compose(
  view.attach({
    store: AppWindowStore,
  }),
  view.electron,
)

export const AppWindow = decorator(({ store }: { store: AppWindowStore }) => {
  log(`Rendering app window at url ${store.url}`)
  return (
    <Window
      ignoreMouseEvents={store.ignoreMouseEvents}
      file={store.url}
      frame={false}
      hasShadow={false}
      // showDevTools={Electron.state.showDevTools.app}
      transparent
      background="#00000000"
      webPreferences={WEB_PREFERENCES}
      position={this.state.position}
      size={Electron.state.screenSize}
    />
  )
})
