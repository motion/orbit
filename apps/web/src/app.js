// @flow
import { Models } from '@mcro/models'
import { DB_CONFIG } from '~/constants'
import AppStore from './stores/appStore'
import adapter from 'pouchdb-adapter-idb'

export CurrentUser from './stores/currentUserStore'

// ugly but we want to export these all here
// this prevents hmr from going nuts when we edit models
export const User = Models.User
export const Thing = Models.Thing
export const Job = Models.Job
export const Setting = Models.Setting

let App

function start() {
  App = new AppStore({
    config: {
      ...DB_CONFIG,
      adapter,
      adapterName: 'idb',
    },
    models: Models,
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
