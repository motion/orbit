// @flow
import { view, store } from '@mcro/black'
import { autorunAsync } from 'mobx'
import { uniqBy } from 'lodash'
import Database from '@mcro/models'

type Options = {
  config: Object,
  models: Object,
}

type ThingRef = {
  name: string,
  thing: Class<any>,
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

  constructor({ config, models }: Options) {
    this.config = config
    this.models = models
    // listen for stuff, attach here
    view.on('store.mount', this.mount('stores'))
    view.on('store.unmount', this.unmount('stores'))
    view.on('view.mount', this.mount('views'))
    view.on('view.unmount', this.unmount('views'))
    view.provide.on('store.mount', this.mount('stores'))
    view.provide.on('store.unmount', this.unmount('stores'))
  }

  async start({ quiet = true } = {}) {
    if (!quiet) {
      console.log(
        '%cUse App.* (models, stores, sync, debug(false)...))',
        'background: yellow'
      )
      console.time('start')
    }
    this.database = new Database(this.config, this.models)
    await this.database.start({
      modelOptions: {
        debug: true,
        // autoSync: {
        //   push: true,
        //   pull: false,
        // },
        // asyncFirstSync: true,
      },
    })
    this.connected = true
    this.catchErrors()
    this.trackMounts()
    if (!quiet) {
      console.timeEnd('start')
    }
    this.started = true
  }

  async dispose() {
    if (this.database) {
      await this.database.dispose()
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
    }, 100)
  }

  key = (name: string, thing: Class<any>) =>
    name === 'store' ? thing.constructor.name : name

  mount = (type: string) => ({ name, thing }: ThingRef) => {
    const key = this.key(name, thing)
    this.mounted[type][key] = this.mounted[type][key] || new Set()
    this.mounted[type][key].add(thing)
    this.mountedVersion++
  }

  unmount = (type: string) => ({ name, thing }: ThingRef) => {
    const key = this.key(name, thing)
    if (this.mounted[type][key]) {
      this.mounted[type][key].delete(thing)
      this.mountedVersion++
    }
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

  clearLocalData() {
    if (!this.models) {
      return
    }
    Object.keys(this.models).forEach(async name => {
      const model = this.models[name]
      await model.database.remove()
      console.log('Removed model local data', name)
    })
  }

  clearAllData() {
    if (!this.models) {
      return
    }
    Object.keys(this.models)
      .filter(name => name === 'Setting')
      .forEach(async name => {
        console.log('Removing', name)
        const model = this.models[name]
        const models = await model.getAll()
        await Promise.all(models.map(model => model.remove()))
        console.log('Removed all', name)
      })
  }
}
