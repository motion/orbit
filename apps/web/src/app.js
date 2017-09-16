// @flow
import { Models } from '@mcro/models'
import * as Constants from '~/constants'
import AppStore from './stores/appStore'
import adapter from 'pouchdb-adapter-idb'
import * as Services from './services'

import CurrentUserX from './stores/currentUserStore'
export const CurrentUser = CurrentUserX

// ugly but we want to export these all here
// this prevents hmr from going nuts when we edit models
export const User = Models.User
export const Thing = Models.Thing
export const Job = Models.Job
export const Setting = Models.Setting
export const Event = Models.Event

function start() {
  return new AppStore({
    config: {
      ...Constants.DB_CONFIG,
      adapter,
      adapterName: 'idb',
    },
    models: Models,
    services: Services,
  })
}

let App = start()
window.App = App

if (!App) {
  start()
}

// hmr
if (module && module.hot) {
  module.hot.accept('@mcro/models', () => {
    if (App) {
      App.dispose()
      App = start()
    }
  })

  module.hot.accept(() => {})
}

export default App
