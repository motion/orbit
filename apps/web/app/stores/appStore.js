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
import type { Model, Models } from '@jot/models'

declare class AppStore {
  images: PouchDB,
  databaseConfig: Object,
  database: ?RxDB.Database,
  modelsList: Array<Models>,
  models?: Models,
}

export default class App implements AppStore {
  @observable.ref errors = []
  @observable.ref mountedStores = {}
  @observable mountedVersion = 0
  @observable.ref stores = null

  constructor({ database, models }) {
    this.databaseConfig = database
    this.modelsList = models

    // listen for stores, attach here
    view.on('store.mount', this.mountStore)
    view.on('store.unmount', this.unmountStore)
  }

  start = async () => {
    console.log('Use App in your console to access models, stores, etc')
    console.time('start')
    this.models = new Models()
    this.catchErrors()
    this.trackMountedStores()
    this.setupImages()
    console.timeEnd('start')
  }

  startModels = () => {
    this.models = new Models(database, models)
  }

  setupImages = () => {
    // images
    this.images = new PouchDB(`${this.databaseConfig.couchUrl}/images`, {
      skipSetup: true,
      withCredentials: false,
    })
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

  @action
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

  @action
  clearErrors = () => {
    this.errors = []
  }
}
