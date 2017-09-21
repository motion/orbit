// @flow
import * as React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvide } from '@mcro/ui'
import Themes from './themes'
import Root from './views/root'
import Layout from './views/layout'
import Jobs from './jobs'
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
export const CurrentUser = CurrentUser_

class App {
  jobs: Jobs
  store: AppStore

  constructor(quiet?: boolean) {
    // this.render() // to render before db connects
    this.store = new AppStore({
      config: {
        ...Constants.DB_CONFIG,
        remoteUrl: `http://${window.location.hostname}/db`,
        adapter,
        adapterName: 'idb',
      },
      models: Models,
      services: Services,
    })
    this.start(quiet)
  }

  async start(quiet: boolean) {
    this.syncSettings()
    await this.store.start(quiet)
    this.jobs = new Jobs()
    this.render()
  }

  async syncSettings() {
    await Setting.find().sync()
  }

  async dispose() {
    await this.store.dispose()
    if (this.jobs) {
      this.jobs.dispose()
    }
  }

  render(): void {
    // console.time('#render')
    let ROOT = document.querySelector('#app')
    ReactDOM.render(
      <Root>
        <ThemeProvide {...Themes}>
          <Layout />
        </ThemeProvide>
      </Root>,
      ROOT
    )
    // console.timeEnd('#render')
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
}

let app = window.App

export async function start(recreate?: boolean) {
  if (app) {
    await app.dispose()
  }
  if (recreate || !app) {
    app = new App(recreate)
    window.App = app
  }
}

export default app

// hmr
if (module && module.hot) {
  module.hot.accept(() => start(true))
  module.hot.accept('@mcro/models', async () => {
    // cutoff models
  })
}
