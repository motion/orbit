// @flow
import * as AllModels from '@mcro/models'
import { DB_CONFIG } from '~/constants'
import { view, store } from '@mcro/black'
import { autorunAsync } from 'mobx'
import { uniqBy } from 'lodash'
import Models from '@mcro/models'

@store
class AppStore {
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

  constructor({ config, models }) {
    this.config = config
    this.modelsObjects = models
    // listen for stuff, attach here
    view.on('store.mount', this.mount('stores'))
    view.on('store.unmount', this.unmount('stores'))
    view.on('view.mount', this.mount('views'))
    view.on('view.unmount', this.unmount('views'))
  }

  start = async quiet => {
    if (!quiet) {
      console.log(
        '%cUse App in your console to access models, stores, etc',
        'background: yellow'
      )
      console.time('start')
    }
    this.models = new Models(this.config, this.modelsObjects)
    console.log('start models')
    await this.models.start()
    this.connected = true
    this.catchErrors()
    this.trackMounts()
    if (!quiet) {
      console.timeEnd('start')
    }
    this.started = true
  }

  dispose = () => {
    this.models && this.models.dispose()
  }

  // private
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
            [key]: entries,
          }
        }, {})

      this.stores = reduce(this.mounted.stores)
      this.views = reduce(this.mounted.views)
    }, 1)
  }

  // private
  mount = type => thing => {
    const key = thing.constructor.name
    this.mounted[type][key] = this.mounted[type][key] || new Set()
    this.mounted[type][key].add(thing)
    this.mountedVersion++
  }

  // private
  unmount = type => thing => {
    const key = thing.constructor.name
    if (this.mounted[type][key]) {
      this.mounted[type][key].delete(thing)
      this.mountedVersion++
    }
  }

  // TODO make this not hacky
  // could actually just be a Proxy around this class that finds these
  get layoutStore(): LayoutStore {
    return this.stores && this.stores.LayoutStore && this.stores.LayoutStore[0]
  }

  get explorer() {
    return (
      this.stores && this.stores.ExplorerStore && this.stores.ExplorerStore[0]
    )
  }

  get editor(): EditorStore {
    if (!this.stores || !this.stores.EditorStore) {
      return
    }
    return this.stores.EditorStore.find(store => !!store.focused)
  }

  get document(): DocumentStore {
    if (!this.stores || !this.stores.DocumentStore) {
      return
    }
    return this.stores.DocumentStore.find(
      store => !!store.props.isPrimaryDocument
    )
  }

  get editorState() {
    return this.editor && this.editor.slate.getState()
  }

  get docLayout() {
    return this.editorState.document.nodes.findByType('docList')
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

const App = new AppStore({
  config: DB_CONFIG,
  models: AllModels,
})

window.App = App

export default App

// hmr
if (module && module.hot) {
  module.hot.accept('@mcro/models', () => {
    log('accept: ./app:@mcro/models')
    // log('got hmr for App, not restarting fully to avoid craziness')
    // require('./start').render()
  })

  module.hot.dispose(() => {
    App.dispose()
  })
}
