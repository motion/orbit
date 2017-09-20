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

type Options = {
  config: Object,
  models: Object,
  services: Object,
}

@store
export default class AppStore {
  config: ?Object
  models: ?Object
  database: Database
  started = false
  connected = false
  errors = []
  mounted = {
    stores: {},
    views: {},
  }
  mountedVersion = 0
  stores: ?Object = null
  views: ?Object = null
  serviceObjects: ?Object = null

  constructor({ config, models, services }: Options) {
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

  start = async (quiet?: boolean) => {
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
        debug: true,
        autoSync: true,
        asyncFirstSync: true,
      },
    })
    this.connected = true
    this.setupServices()
    this.catchErrors()
    this.trackMounts()
    if (!quiet) {
      console.timeEnd('start')
    }
    this.started = true
  }

  setupServices() {
    if (!CurrentUser.user) {
      throw new Error('No way')
    }
    this.services = {}
    for (const serviceName of Object.keys(this.serviceObjects)) {
      this.services[serviceName] = new this.serviceObjects[serviceName](
        CurrentUser
      )
    }
  }

  dispose = () => {
    this.database && this.database.dispose()
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
    }, 100)
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

  clearLocalData() {
    Object.keys(this.models).forEach(async name => {
      const model = this.models[name]
      await model.database.remove()
      console.log('Removed model local data', name)
    })
  }

  clearAllData() {
    Object.keys(this.models).forEach(async name => {
      const model = this.models[name]
      const models = await model.getAll()
      await Promise.all(models.map(model => model.remove()))
      console.log('Removed all models', name)
    })
  }
}
