import { Emitter, CompositeDisposable } from 'sb-event-kit'
import { persistStore } from '~/helpers'
import ClassHelpers from './classHelpers'
import autobind from 'autobind-decorator'
import mixin from 'react-mixin'
import { fromPromise } from 'mobx-utils'
import { Observable } from 'rxjs'
import {
  action,
  isObservable,
  extendShallowObservable,
  extendObservable,
  autorun,
} from 'mobx'
import createStoreProvider from './external/storeProvider'
import App from '@jot/models'

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
    automagicalStores(store)
    if (store.start) {
      store.start(props)
    }
    return store
  },
  onStoreDidMount(name, store) {
    App.mountStore(store)
  },
  onStoreUnmount(name, store) {
    App.unmountStore(store)
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

function automagicalStores(obj) {
  // automagic observables
  const proto = Object.getPrototypeOf(obj)
  const fproto = Object.getOwnPropertyNames(proto).filter(
    x => !FILTER_KEYS[x] && x[0] !== '_'
  )

  const descriptors = {
    ...Object.getOwnPropertyDescriptors(obj),
    // gets the getters
    ...fproto.reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: Object.getOwnPropertyDescriptor(proto, cur),
      }),
      {}
    ),
  }

  // mutate objects to be magical
  for (const method of Object.keys(descriptors)) {
    automagicalValue(obj, method, descriptors)
  }
}

// mutative
function automagicalValue(obj, method, descriptors = {}) {
  if (/^(\$mobx|subscriptions|props|\_.*)$/.test(method)) {
    return
  }

  // auto @computed get, do this before getting val
  const descriptor = descriptors[method]
  if (descriptor && descriptor.get) {
    const getter = {
      [method]: null,
    }
    Object.defineProperty(getter, method, descriptor)
    extendObservable(obj, getter)
    return
  }

  // not get, we can check value
  let val = obj[method]

  // auto run autoruns ;)
  if (isAutorun(val)) {
    extendShallowObservable(obj, { [method]: null })
    const autorunner = autorun(() => {
      const previous = obj[method]
      obj[method] = val()
      automagicalValue(obj, method)
      // unsubscribe from previous
      if (previous && previous !== null) {
        // hacky, remove old listener, should be done nicer
        if (typeof previous === 'function') {
          previous()
        }
        if (typeof previous.dispose === 'function') {
          previous.dispose()
        }
        if (typeof previous.remove === 'function') {
          previous.remove()
        }
      }
      // need to run this to ensure it wraps autorun value magically
    })
    obj.subscriptions.add(autorunner)
    return
  }

  // auto resolve promise
  if (val instanceof Promise) {
    const observable = fromPromise(val)
    Object.defineProperty(obj, method, {
      get() {
        return observable.value
      },
    })
    // TODO: make a query that contains a promsie work
    return
  }

  const isFunction = typeof val === 'function'
  const isQuery = val && val.$isQuery

  // auto @query => observable
  if (isQuery) {
    Object.defineProperty(obj, method, {
      get() {
        return val.current
      },
    })
    obj.subscriptions.add(val)
    return
  }

  // if already Mobx observable, just let it be yo
  if (isObservable(val)) {
    return
  }

  // auto Rx => mobx
  if (val instanceof Observable) {
    const observable = observableRxToObservableMobx(obj, method)
    obj.subscriptions.add(observable)
    return
  }

  // auto actions
  if (isFunction) {
    // @action functions
    obj[method] = action(
      `${obj.constructor.name}.${obj.id ? `${obj.id}.` : ''}${method}`,
      obj[method]
    )
  } else {
    // auto everything is an @observable.ref
    extendShallowObservable(obj, { [method]: val })
  }
}

// extends store with a proxy, make it cool
export default function store(Store) {
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
