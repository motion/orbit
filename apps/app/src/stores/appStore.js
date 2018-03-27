// @flow
import { store } from '@mcro/black'
import { uniqBy } from 'lodash'
import Database, { Models } from '@mcro/models'
import * as Constants from '~/constants'
import adapter from 'pouchdb-adapter-idb'

@store
export default class AppStore {
  database: Database
  started = false
  connected = false
  errors = []

  async start({ quiet = true } = {}) {
    if (!quiet) {
      console.log(
        '%cUse Root.* (models, stores, sync, debug(false)...))',
        'background: yellow',
      )
      console.time('start')
    }
    this.database = new Database(
      {
        ...Constants.DB_CONFIG,
        remoteUrl: `${Constants.API_URL}/db`,
        adapter,
        adapterName: 'idb',
      },
      Models,
    )
    await this.database.start({
      modelOptions: {
        debug: true,
        // autoSync: {
        //   push: true,
        //   pull: true,
        // },
        asyncFirstSync: true,
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
