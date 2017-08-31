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

let App

function start() {
  App = new AppStore({
    config: {
      ...Constants.DB_CONFIG,
      adapter,
      adapterName: 'idb',
    },
    models: Models,
    services: Services,
  })
  window.App = App
  return App
}

if (!App) {
  start()
}

// hmr
if (module && module.hot) {
  module.hot.accept('@mcro/models', () => {
    App.dispose()
    start()
  })

  module.hot.accept(() => {
    log('accepted ~/app')
  })
}

export default App
