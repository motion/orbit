import { App } from '@mcro/all'
import { sleep, debugState } from '@mcro/black'
import { ThemeProvide } from '@mcro/ui'
import * as React from 'react'
import ReactDOM from 'react-dom'
import Themes from './themes'
import { uniqBy } from 'lodash'
import * as UI from '@mcro/ui'
import { modelsList } from '@mcro/models'
import connectModels from './helpers/connectModels'

// HMR
if (module.hot) {
  module.hot.accept(async () => {
    if (window.runRouter) {
      window.runRouter()
    }
    await start(true)
  })
}

const onPort = async cb => {
  await sleep(200)
  try {
    await fetch('http://localhost:3001')
    cb()
  } catch (_) {
    onPort(cb)
  }
}

class AppRoot {
  started = false
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
    if (window.location.pathname !== '/auth') {
      await connectModels(modelsList)
      await App.start()
    }
    this.render()
    this.catchErrors()
    this.started = true
  }

  async restart() {
    onPort(() => (window.location = window.location))
  }

  async dispose() {}

  render() {
    const isResults = window.location.pathname === '/results'
    const RootComponent = isResults
      ? require('./apps/results/results').default
      : require('./root').default
    ReactDOM.render(
      <ThemeProvide {...Themes}>
        <UI.Theme name="tan">
          <RootComponent />
        </UI.Theme>
      </ThemeProvide>,
      document.querySelector('#app'),
    )
  }

  handleError = (...errors) => {
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

export async function start(recreate) {
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
