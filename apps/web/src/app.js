// @flow
import * as React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvide } from '@mcro/ui'
import Themes from './themes'
import Root from './views/root'
import Sync from './sync'
import { Models } from '@mcro/models'
import * as Constants from '~/constants'
import AppStore from './stores/appStore'
import adapter from 'pouchdb-adapter-idb'
import * as Services from './services'
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
    this.render() // to render before db connects
    this.store = new AppStore({
      config: {
        ...Constants.DB_CONFIG,
        remoteUrl: `${Constants.API_URL}/db`,
        adapter,
        adapterName: 'idb',
      },
      models: Models,
      services: Services,
    })
  }

  async start(quiet?: boolean) {
    await this.store.start(quiet)
    // this fixes weird issues with model.isntConnected in mobx
    const jobs = (await Job.pending().exec()) || []
    jobs.map(job => job.remove())
    this.sync = new Sync()
    this.sync.start()
    this.render()
    this.started = true
  }

  async dispose() {
    await this.store.dispose()
    if (this.sync) {
      this.sync.dispose()
    }
    if (super.dispose) {
      super.dispose()
    }
  }

  render(): void {
    let ROOT = document.querySelector('#app')
    ReactDOM.render(
      <ThemeProvide {...Themes}>
        <Root />
      </ThemeProvide>,
      ROOT
    )
  }

  // helpers that wrap appStore
  get services(): Object {
    return this.store && this.store.services
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

  debug(setting) {
    if (!setting) {
      localStorage.setItem('debug', 'none')
      debug.enable('')
    } else {
      localStorage.setItem('debug', setting)
      debug.enable(setting)
    }
  }
}

let app = window.App

export async function start(recreate?: boolean) {
  if (window.appDisposing) {
    return
  }
  window.appDisposing = true
  if (app) {
    await app.dispose()
  }
  if (recreate || !app) {
    app = new App()
    window.App = app
    await app.start(recreate)
  }
  window.appDisposing = false
}

if (!window.App) {
  start()
}

export default app
