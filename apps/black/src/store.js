import autobound from './plugins/core/autobound'
import emittable from './plugins/core/emittable'
import automagical from './plugins/mobx/automagical'
import subscribable from './plugins/react/subscribable'
import subscribableHelpers from './plugins/core/subscribableHelpers'
import storeProvidable from './plugins/react/storeProvidable'

import ClassHelpers from './helpers/classHelpers'
import autobind from 'autobind-decorator'
import mixin from 'react-mixin'
import createStoreProvider from './external/storeProvider'
import { IS_PROD } from './constants'

const storeDecorator = decor([
  autobound,
  subscribable,
  subscribableHelpers,
  emittable,
  automagical,
])

// (Store) {
//     // this makes it work with hmr! :)
//     if (Store.isDecorated) return Store
//     Store.isDecorated = true
//     // mixins
//     mixin(Store.prototype, ClassHelpers)

//     return autobind(Store)
//   }

export const config = {
  storeDecorator,
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

export function storeDecorator(Store) {
  config.storeDecorator(Store)
  const ProxyStore = function(...args) {
    const store = new Store(...args)
    config.onStoreMount(Store.constructor.name, store, args[0])
    config.onStoreDidMount(Store.constructor.name, store, args[0])
    return store
  }
  return ProxyStore
}
