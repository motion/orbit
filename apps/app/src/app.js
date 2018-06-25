import { App as _App } from '@mcro/stores'
import { sleep, debugState } from '@mcro/black'
import { uniqBy } from 'lodash'
import { modelsList } from '@mcro/models'
import connectModels from './helpers/connectModels'

const onPort = async cb => {
  await sleep(200)
  try {
    await fetch('http://localhost:3001')
    cb()
  } catch (_) {
    onPort(cb)
  }
}

export class App {
  connection = null
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
      await this.connectModels()
      await _App.start()
    }
    this.catchErrors()
    this.started = true
  }

  async connectModels() {
    this.connection = await connectModels(modelsList)
  }

  async restart() {
    onPort(() => (window.location = window.location))
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
