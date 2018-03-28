// @flow
import { debugState } from '@mcro/black'
import { ThemeProvide } from '@mcro/ui'
import * as Models from '@mcro/models'
import connectModels from './helpers/connectModels'
import * as React from 'react'
import ReactDOM from 'react-dom'
import Themes from './themes'
import Root from './root'
import AppStore from './stores/appStore'
import Services from './services'

class App {
  started = false
  services = Services
  stores = null
  views = null

  get errors(): ?Array<any> {
    return this.appStore && this.appStore.errors
  }

  constructor() {
    window.Root = this
    window.restart = this.restart
    this.appStore = new AppStore()
    debugState(({ stores, views }) => {
      this.stores = stores
      this.views = views
    })
  }

  async start({ quiet } = {}) {
    await this.appStore.start(quiet)
    await connectModels(Object.keys(Models).map(x => Models[x]))
    this.render()
    this.started = true
  }

  restart() {
    window.location = window.location
  }

  async dispose() {
    await this.appStore.dispose()
  }

  render() {
    let ROOT = document.querySelector('#app')
    ReactDOM.render(
      <ThemeProvide {...Themes}>
        <Root />
      </ThemeProvide>,
      ROOT,
    )
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
