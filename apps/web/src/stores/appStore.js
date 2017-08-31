// @flow
import { view, store } from '@mcro/black'
import { autorunAsync } from 'mobx'
import { uniqBy } from 'lodash'
import Database from '@mcro/models'
import CurrentUser from './currentUserStore'

if (module.hot) {
  module.hot.accept('@mcro/models', () => {
    log('no accept @mcro/models')
  })
}

@store
export default class AppStore {
  database: Database
  started = false
  connected = false
  errors = []
  mounted = {
    stores: {},
    views: {},
  }
  mountedVersion = 0
  stores = null
  views = null
  services = null

  constructor({ config, models, services }) {
    this.config = config
    this.models = models
    this.serviceObjects = services
    // listen for stuff, attach here
    view.on('store.mount', this.mount('stores'))
    view.on('store.unmount', this.unmount('stores'))
    view.on('view.mount', this.mount('views'))
    view.on('view.unmount', this.unmount('views'))
    view.provide.on('store.mount', this.mount('stores'))
    view.provide.on('store.unmount', this.unmount('stores'))
  }

  start = async (quiet = true) => {
    if (!quiet) {
      console.log(
        '%cUse App in your console to access models, stores, etc',
        'background: yellow'
      )
      console.time('start')
    }
    this.database = new Database(this.config, this.models)
    await this.database.start({
      modelOptions: {
        autoSync: false,
        asyncFirstSync: false,
      },
    })
    this.connected = true
    this.catchErrors()
    this.trackMounts()
    this.setupServices()
    if (!quiet) {
      console.timeEnd('start')
    }
    this.started = true
  }

  dispose = () => {
    this.database && this.database.dispose()
  }

  setupServices = () => {
    this.services = {}
    for (const serviceName of Object.keys(this.serviceObjects)) {
      this.services[serviceName] = new this.serviceObjects[serviceName](
        CurrentUser
      )
    }
  }

  trackMounts = () => {
    // auto Object<string, Set> => Object<string, []>
    autorunAsync(() => {
      this.mountedVersion
      const reduce = object =>
        Object.keys(object).reduce((acc, key) => {
          const entries = []
          object[key].forEach(store => {
            entries.push(store)
          })
          return {
            ...acc,
            // nice helper: turn just one array into a singular item
            [key]: entries.length === 1 ? entries[0] : entries,
          }
        }, {})

      this.stores = reduce(this.mounted.stores)
      this.views = reduce(this.mounted.views)
    }, 1)
  }

  key = (name, thing) => (name === 'store' ? thing.constructor.name : name)

  mount = type => ({ name, thing }) => {
    const key = this.key(name, thing)
    this.mounted[type][key] = this.mounted[type][key] || new Set()
    this.mounted[type][key].add(thing)
    this.mountedVersion++
  }

  unmount = type => ({ name, thing }) => {
    const key = this.key(name, thing)
    if (this.mounted[type][key]) {
      this.mounted[type][key].delete(thing)
      this.mountedVersion++
    }
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
