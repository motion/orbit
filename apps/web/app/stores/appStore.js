// @flow
import { view } from '@jot/black'
import { observable, computed, action, autorunAsync } from 'mobx'
import * as RxDB from 'rxdb'
import PouchDB from 'pouchdb-core'
import pIDB from 'pouchdb-adapter-idb'
import pREPL from 'pouchdb-replication'
import pHTTP from 'pouchdb-adapter-http'
import pValidate from 'pouchdb-validation'
import pSearch from 'pouchdb-quick-search'
import { uniqBy } from 'lodash'
import type { Model } from '@jot/models/helpers'

export default class App {
  images: PouchDB
  databaseConfig: Object
  database: ?RxDB.Database = null
  models: ?Model = null
  @observable.ref errors = []
  @observable.ref mountedStores = {}
  @observable mountedVersion = 0
  @observable.ref stores = null

  constructor({ database, models }) {
    if (!database || !models) {
      throw new Error(
        'No database or models given to App!',
        typeof database,
        typeof models
      )
    }

    this.databaseConfig = database
    this.models = models

    // listen for stores, attach here
    view.on('store.mount', this.mountStore)
    view.on('store.unmount', this.unmountStore)
  }

  setupRxDB = async () => {
    // hmr fix
    if (!RxDB.PouchDB.replicate) {
      RxDB.QueryChangeDetector.enable()
      // RxDB.QueryChangeDetector.enableDebugging()
      RxDB.plugin(pHTTP)
      RxDB.plugin(pIDB)
      RxDB.plugin(pREPL)
      RxDB.plugin(pValidate)
      RxDB.plugin(pSearch)
      PouchDB.plugin(pHTTP)
    }

    // connect to pouchdb
    console.time('create db')
    this.database = await RxDB.create({
      adapter: 'idb',
      name: this.databaseConfig.name,
      password: this.databaseConfig.password,
      multiInstance: true,
      withCredentials: false,
    })
    console.timeEnd('create db')
  }

  start = async () => {
    console.log('Use App in your console to access models, stores, etc')
    console.time('start')
    this.catchErrors()
    await this.setupRxDB()
    this.trackMountedStores()
    await this.attachModels(this.models)
    this.setupImages()
    console.timeEnd('start')
  }

  setupImages = () => {
    // images
    this.images = new PouchDB(`${this.databaseConfig.couchUrl}/images`, {
      skipSetup: true,
      withCredentials: false,
    })
  }

  attachModels = async (models: Object) => {
    console.time('attachModels')
    const connections = []

    // attach Models to app and connect if need be
    for (const [name, model] of Object.entries(models)) {
      this[name] = model

      if (typeof model.connect !== 'function') {
        throw `No connect found for model ${model.name} connect = ${typeof model.connect}`
      }

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
