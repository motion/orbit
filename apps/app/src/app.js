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
import RootComponent from './root'

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

  async start({ recreate }) {
    if (!recreate && window.location.pathname !== '/auth') {
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
    console.log('rendering')
    ReactDOM.render(
      <ThemeProvide {...Themes}>
        <UI.Theme name="light">
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

export async function start(recreate) {
  console.log('app.start')
  let app = window.Root
  if (window._isDisposing || (app && !recreate)) {
    console.log('already disposing', window._isDisposing)
    return
  }
  window._isDisposing = true
  if (app) {
    await app.dispose()
    app = null
    recreate = true
  }
  if (recreate || !app) {
    app = new AppRoot()
    await app.start({ recreate })
  }
  log('NOPENOPENOPE')
  window._isDisposing = false
  return app
}
