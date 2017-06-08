import { observable, computed, action, autorunAsync } from 'mobx'
import * as RxDB from 'motion-rxdb'
import PouchDB from 'pouchdb-core'
import pIDB from 'pouchdb-adapter-idb'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'
import pAuth from 'pouchdb-authentication'
import pValidate from 'pouchdb-validation'
import pSearch from 'pouchdb-quick-search'
import { uniqBy } from 'lodash'

RxDB.QueryChangeDetector.enable()
// RxDB.QueryChangeDetector.enableDebugging()

import * as Models from './all'

class App {
  db = null
  @observable.ref errors = []
  @observable.ref mountedStores = {}
  @observable mountedVersion = 0
  @observable.ref stores = null

  constructor() {
    // hmr fix
    if (!RxDB.PouchDB.replicate) {
      RxDB.plugin(pHTTP)
      RxDB.plugin(pIDB)
      RxDB.plugin(pREPL)
      RxDB.plugin(pValidate)
      RxDB.plugin(pSearch)
      PouchDB.plugin(pAuth)
      PouchDB.plugin(pHTTP)
    }

    this.trackMountedStores()
  }

  async start({ database }) {
    console.time('start')
    this.catchErrors()

    console.log('Use App in your console to access models, stores, etc')

    if (!database) {
      throw new Error('No config given to App!')
    }

    // attach
    this.databaseConfig = database

    // connect to pouchdb
    console.time('create db')
    this.database = await RxDB.create({
      adapter: 'idb',
      name: database.name,
      password: database.password,
      multiInstance: true,
      withCredentials: false,
      pouchSettings: {
        skip_setup: true,
        // live: true,
        retry: true,
        since: 'now',
      },
    })
    console.timeEnd('create db')

    await this.attachModels(Models)

    // images
    this.images = new PouchDB(`${database.couchUrl}/images`, {
      skip_setup: true,
      with_credentials: false,
    })

    console.timeEnd('start')
  }

  attachModels = async (models: Object) => {
    console.time('attachModels')
    const connections = []

    // attach Models to app and connect if need be
    for (const [name, model] of Object.entries(models)) {
      this[name] = model

      connections.push(
        model.connect(this.database, this.databaseConfig, {
          sync: `${this.databaseConfig.couchUrl}/${model.title}/`,
        })
      )
    }

    const result = await Promise.all(connections)
    console.timeEnd('attachModels')
    return result
  }

  // dev helpers

  trackMountedStores = () => {
    // auto Object<string, Set> => Object<string, []>
    autorunAsync(() => {
      this.mountedVersion
      this.stores = Object.keys(this.mountedStores).reduce((acc, key) => {
        const entries = []
        this.mountedStores[key].forEach(store => {
          entries.push(store)
        })
        return {
          ...acc,
          [key]: entries,
        }
      }, {})
    }, 1)
  }

  mountStore = store => {
    const key = store.constructor.name
    this.mountedStores[key] = this.mountedStores[key] || new Set()
    this.mountedStores[key].add(store)
    this.mountedVersion++
  }

  unmountStore = store => {
    const key = store.constructor.name
    if (this.mountedStores[key]) {
      this.mountedStores[key].delete(store)
      this.mountedVersion++
    }
  }

  get editor() {
    return (
      (this.stores &&
        this.stores.EditorStore &&
        this.stores.EditorStore.find(store => store.focused === true)) ||
      this.stores.EditorStore[0]
    )
  }

  get editorState() {
    return this.editor && this.editor.slate.getState()
  }

  get docLayout() {
    return this.editorState.document.nodes.findByType('docList')
  }

  // actions

  @action handleError = (...errors) => {
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

  @action clearErrors = () => {
    this.errors = []
  }
}

const app = window.App || new App()

if (module && module.hot) {
  module.hot.accept('./all', () => {
    console.log('hmr from @jot/models/app', app)
    app.attachModels(require('./all'))
  })
}

export default app
