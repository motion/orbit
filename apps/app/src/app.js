// @flow
import * as React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvide } from '@mcro/ui'
import Themes from './themes'
import Root from './root'
import { Models } from '@mcro/models'
import * as Constants from '~/constants'
import AppStore from './stores/appStore'
import adapter from 'pouchdb-adapter-idb'
import Services from './services'
import CurrentUser_ from './stores/currentUserStore'

// ugly but we want to export these all here
// this prevents hmr from going nuts when we edit models
export const User = Models.User
export const Thing = Models.Thing
export const Job = Models.Job
export const Setting = Models.Setting
export const Event = Models.Event
export const Person = Models.Person
export const CurrentUser = CurrentUser_

class App {
  sync: Sync
  store: AppStore
  started = false

  constructor() {
    window.restart = this.restart
    // this.render() // to render before db connects
    this.store = new AppStore({
      config: {
        ...Constants.DB_CONFIG,
        remoteUrl: `${Constants.API_URL}/db`,
        adapter,
        adapterName: 'idb',
      },
      models: Models,
    })
  }

  async start(quiet?: boolean) {
    await this.store.start(quiet)
    this.render()
    this.started = true
  }

  restart() {
    window.location = window.location
  }

  async dispose() {
    await this.store.dispose()
  }

  render(): void {
    let ROOT = document.querySelector('#app')
    ReactDOM.render(
      <ThemeProvide {...Themes}>
        <Root />
      </ThemeProvide>,
      ROOT,
    )
  }

  // helpers that wrap appStore
  get services(): Services {
    return Services
  }

  get database(): Object {
    return this.store && this.store.database
  }

  get errors(): ?Array<any> {
    return this.store && this.store.errors
  }

  get stores(): Object {
    return this.store && this.store.stores
  }

  get views(): Object {
    return this.store && this.store.views
  }

  get models(): Object {
    return this.store && this.store.models
  }
}

let app = window.Root
export async function start(recreate?: boolean) {
  if (window.Root || window._isDisposing) return
  window._isDisposing = true
  if (app) {
    await app.dispose()
  }
  if (recreate || !app) {
    app = new App()
    window.Root = app
    await app.start({ quiet: recreate })
  }
  window._isDisposing = false
}

// start!
start()

export default app

// HMR
if (module && module.hot) {
  module.hot.accept('./stores/appStore', async () => {
    await start(true)
  })
  module.hot.accept('.', async () => {
    await start(true)
  })
}
