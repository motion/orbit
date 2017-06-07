import decor from '@jot/decor'
import autobound from '@jot/decor/plugins/core/autobound'
import emittable from '@jot/decor/plugins/core/emittable'
import automagical from '@jot/decor/plugins/mobx/automagical'
import subscribable from '@jot/decor/plugins/react/subscribable'
import subscribableHelpers from '@jot/decor/plugins/core/subscribableHelpers'
import storeProvidable from '@jot/decor/plugins/react/storeProvidable'

const storeDecorator = decor([
  autobound,
  subscribable,
  subscribableHelpers,
  emittable,
])

export const storeProvider = decor([
  [
    storeProvidable,
    {
      storeDecorator,
      onStoreMount(name, store, props) {
        storeMountDecorator(store)
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
    },
  ],
])

export default function store(Store) {
  storeDecorator(Store)
  const ProxyStore = function(...args) {
    const store = new Store(...args)
    config.onStoreMount(Store.constructor.name, store, args[0])
    config.onStoreDidMount(Store.constructor.name, store, args[0])
    return store
  }
  return ProxyStore
}

// (Store) {
//     // this makes it work with hmr! :)
//     if (Store.isDecorated) return Store
//     Store.isDecorated = true
//     // mixins
//     mixin(Store.prototype, ClassHelpers)

//     return autobind(Store)
//   }

// add subscriptions
// store.subscriptions = new CompositeDisposable()
// // add emitter
// store.emit = store.emitter.emit.bind(store.emitter)
// // unmount
// store.subscriptions.add(store.emitter)
// mount actions
