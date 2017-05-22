import { persistStore } from '~/helpers'
import ClassHelpers from './classHelpers'
import autobind from 'autobind-decorator'
import mixin from 'react-mixin'
import { fromPromise } from 'mobx-utils'
import { CompositeDisposable } from 'motion-class-helpers'
import { Observable } from 'rxjs'
import {
  action,
  isObservable,
  extendShallowObservable,
  extendObservable,
} from 'mobx'
import createStoreProvider from './external/storeProvider'
import App from '@jot/models'
import { pickBy } from 'lodash'

export const config = {
  storeDecorator(Store) {
    mixin(Store.prototype, ClassHelpers)
    return autobind(Store)
  },
  onStoreMount(name, store, props) {
    store.subscriptions = new CompositeDisposable()

    // unmount
    store.subscriptions.add(config.onStoreUnmount(name, store))

    // mount actions
    automagicalStores(store)
    if (store.start) {
      store.start(props)
    }
    return store
  },
  onStoreDidMount(name, store) {
    App.setStore(store.constructor.name, store)
  },
  onStoreUnmount(name, store) {
    if (store.stop) {
      store.stop()
    }
    App.removeStore(store.constructor.name)
    store.subscriptions.dispose()
  },
}

export const storeProvider = createStoreProvider(config)

function observableRxToObservableMobx(obj, method) {
  extendShallowObservable(obj, { [method]: fromStream(obj[method]) })
  return obj[method]
}

function automagicalStores(obj) {
  // automagic observables
  const proto = Object.getPrototypeOf(obj)
  const fproto = Object.getOwnPropertyNames(proto).filter(
    x =>
      !/^(__.*|dispose|constructor|start|react|ref|setInterval|setTimeout|addEvent|watch)$/.test(
        x
      )
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

  for (const method of Object.keys(descriptors)) {
    if (/^(\$mobx|subscriptions|props|\_.*)$/.test(method)) {
      continue
    }

    // auto @computed get, do this before getting val
    const descriptor = descriptors[method]
    if (descriptor.get) {
      const getter = {
        [method]: null,
      }
      Object.defineProperty(getter, method, descriptor)
      extendObservable(obj, getter)
      continue
    }

    // not get, we can check value
    const val = obj[method]

    // auto resolve promise
    if (val instanceof Promise) {
      const observable = fromPromise(val)
      Object.defineProperty(obj, method, {
        get() {
          return observable.value
        },
      })
      // TODO: make a query that contains a promsie work
      continue
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
      continue
    }

    if (isObservable(val)) {
      continue
    }

    // auto Rx => mobx
    if (val instanceof Observable) {
      const observable = observableRxToObservableMobx(obj, method)
      obj.subscriptions.add(observable)
      continue
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
