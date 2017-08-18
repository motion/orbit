// @flow
import { Models } from '@mcro/models'
import { DB_CONFIG } from '~/constants'
import AppStore from './stores/appStore'
import adapter from 'pouchdb-adapter-idb'

export CurrentUser from './stores/currentUserStore'

// ugly but we want to export these all here
export const User = Models.User
export const Document = Models.Document
export const Thing = Models.Thing
export const Inbox = Models.Inbox
export const Thread = Models.Thread
export const Reply = Models.Reply
export const Image = Models.Image
export const Job = Models.Job
export const Org = Models.Org

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
