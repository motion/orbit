import automagical from './automagical'
import { Emitter, CompositeDisposable } from 'sb-event-kit'
import ClassHelpers from './helpers/classHelpers'
import autobind from 'autobind-decorator'
import mixin from 'react-mixin'
import createStoreProvider from './external/storeProvider'
import { IS_PROD } from './constants'

export storeAttacher from './external/storeAttacher'

const isAutorun = val => val && val.autorunme

export const config = {
  storeDecorator(Store) {
    // this makes it work with hmr! :)
    if (Store.isDecorated) return Store
    Store.isDecorated = true
    // mixins
    mixin(Store.prototype, ClassHelpers)
    // store.emitter
    Object.defineProperty(Store.prototype, 'emitter', {
      get() {
        if (!this._emitter) {
          this._emitter = new Emitter()
        }
        return this._emitter
      },
    })
    return autobind(Store)
  },
  onStoreMount(name, store, props) {
    // add subscriptions
    store.subscriptions = new CompositeDisposable()
    // add emitter
    store.emit = store.emitter.emit.bind(store.emitter)
    // unmount
    store.subscriptions.add(store.emitter)
    // mount actions
    automagical(store)
    if (store.start) {
      store.start(props)
    }
    return store
  },
  onStoreDidMount(name, store) {
    // App.mountStore(store)
  },
  onStoreUnmount(name, store) {
    // App.unmountStore(store)
    if (store.stop) {
      store.stop()
    }
    store.subscriptions.dispose()
  },
}

export const storeProvider = createStoreProvider(config)

function observableRxToObservableMobx(obj, method) {
  extendShallowObservable(obj, { [method]: fromStream(obj[method]) })
  return obj[method]
}

const FILTER_KEYS = {
  dispose: true,
  constructor: true,
  start: true,
  react: true,
  ref: true,
  setInterval: true,
  setTimeout: true,
  addEvent: true,
  watch: true,
}

function decorateStore(Store) {
  config.storeDecorator(Store)

  const ProxyStore = function(...args) {
    const store = new Store(...args)
    config.onStoreMount(Store.constructor.name, store, args[0])
    config.onStoreDidMount(Store.constructor.name, store, args[0])
    return store
  }

  // add our decorations
  return ProxyStore
}

// extends store with a proxy, make it cool
export default function store(Store) {
  if (IS_PROD) return decorateStore(Store)
  else {
    try {
      return decorateStore(Store)
    } catch (e) {
      console.error(`Error decorating store: ${Store.name}`, Store)
      throw e
    }
  }
}
