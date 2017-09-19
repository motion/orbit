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

export default class App {
  jobs: Jobs
  store: AppStore

  constructor() {
    // render() // to render before db connects
    this.store = new AppStore({
      config: {
        ...Constants.DB_CONFIG,
        adapter,
        adapterName: 'idb',
      },
      models: Models,
      services: Services,
    })
    this.render()
  }

  async start() {
    this.jobs = new Jobs()
    await this.jobs.start()
  }

  dispose() {
    this.store.dispose()
    this.jobs.dispose()
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
  get services() {
    return this.store.services
  }

  get database() {
    return this.store.database
  }

  get errors() {
    return this.store.errors
  }

  get stores() {
    return this.store.stores
  }

  get views() {
    return this.store.views
  }
}

// hmr
if (module && module.hot) {
  module.hot.accept(_ => _)
}
