import { store } from '@mcro/black'
import { sleep, debugState } from '@mcro/black'
import { uniqBy } from 'lodash'
import { getGlobalConfig } from '@mcro/config'

const Config = getGlobalConfig()

const onPort = async cb => {
  await sleep(200)
  try {
    await fetch(`http://localhost:${Config.ports.server}`)
    cb()
  } catch (_) {
    onPort(cb)
  }
}

// @ts-ignore
@store
export class RootStore {
  started = false
  stores = null
  views = null
  errors = []

  constructor() {
    this.catchErrors()
    this.started = true
    debugState(({ stores, views }) => {
      this.stores = stores
      this.views = views
    })
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
      console.log('unhandler rejection', event)
      event.promise.catch(err => {
        this.handleError({ ...err, reason: event.reason })
      })
    })
  }

  clearErrors = () => {
    this.errors = []
  }
}
