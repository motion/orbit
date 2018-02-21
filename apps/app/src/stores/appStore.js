// @flow
import { store, debugState } from '@mcro/black'
import { uniqBy } from 'lodash'
import Database from '@mcro/models'

type Options = {
  config: Object,
  models: Object,
}

@store
export default class AppStore {
  config: ?Object
  models: ?Object
  database: Database
  started = false
  connected = false
  errors = []
  stores = null
  views = null

  constructor({ config, models }: Options) {
    this.config = config
    this.models = models
    // listen for stuff, attach here
    debugState(({ stores, views }) => {
      this.stores = stores
      this.views = views
    })
  }

  async start({ quiet = true } = {}) {
    if (!quiet) {
      console.log(
        '%cUse App.* (models, stores, sync, debug(false)...))',
        'background: yellow',
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
