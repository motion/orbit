// @flow
import * as AllModels from '@mcro/models'
import { DB_CONFIG } from '~/constants'
import AppStore from './stores/appStore'
import adapter from 'pouchdb-adapter-idb'

export * from '@mcro/models'

let App

function start() {
  App = new AppStore({
    config: {
      ...DB_CONFIG,
      adapter,
      adapterName: 'idb',
    },
    models: AllModels,
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
