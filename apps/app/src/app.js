// @flow
import { App } from '@mcro/all'
import { debugState, when } from '@mcro/black'
import { ThemeProvide } from '@mcro/ui'
import { sleep } from '~/helpers'
import * as Models from '@mcro/models'
import connectModels from './helpers/connectModels'
import * as React from 'react'
import ReactDOM from 'react-dom'
import Themes from './themes'
import Root from './root'
import Services from './services'
import { uniqBy } from 'lodash'
import * as Constants from '~/constants'

// HMR
if (module && module.hot) {
  module.hot.accept('.', async () => {
    await start(true)
  })
}

class AppRoot {
  started = false
  services = Services
  stores = null
  views = null
  errors = []

  constructor() {
    window.Root = this
    window.restart = this.restart
    debugState(({ stores, views }) => {
      this.stores = stores
      this.views = views
    })
  }

  async start() {
    await App.start()
    if (Constants.IS_PEEK) {
      console.log('sleep for orbit connect')
      await sleep(2000)
      console.log('done orbit connect')
    }
    await connectModels(Object.keys(Models).map(x => Models[x]))
    if (Constants.IS_ORBIT) {
      App.setOrbitConnected(true)
    }
    this.render()
    this.catchErrors()
    this.started = true
  }

  restart() {
    window.location = window.location
  }

  async dispose() {}

  render() {
    let ROOT = document.querySelector('#app')
    ReactDOM.render(
      <ThemeProvide {...Themes}>
        <Root />
      </ThemeProvide>,
      ROOT,
    )
  }

  handleError = (...errors: Array<Error>) => {
    const unique = uniqBy(errors, err => err.name)
    const final = []
    for (const error of unique) {
      try {
        final.push(JSON.parse(error.message))
      } catch (e) {
        final.push({ id: Math.random(), ...error })
      }
    }
    this.errors = uniqBy([...final, ...this.errors], err => err.id)
  }

  catchErrors() {
    window.addEventListener('unhandledrejection', event => {
      event.promise.catch(err => {
        this.handleError({ ...err, reason: event.reason })
      })
    })
  }

  clearErrors = () => {
    this.errors = []
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
    app = new AppRoot()
    await app.start({ quiet: recreate })
  }
  window._isDisposing = false
}

// start!
start()

export default app
