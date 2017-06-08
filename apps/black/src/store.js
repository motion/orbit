import decor from '@jot/decor'
import autobound from '@jot/decor/lib/plugins/core/autobound'
import emittable from '@jot/decor/lib/plugins/core/emittable'
import automagical from '@jot/decor/lib/plugins/mobx/automagical'
import subscribable from '@jot/decor/lib/plugins/react/subscribable'
import subscribableHelpers from '@jot/decor/lib/plugins/core/subscribableHelpers'
import storeProvidable from '@jot/decor/lib/plugins/react/storeProvidable'

export const storeDecorator = decor([
  subscribable,
  subscribableHelpers,
  emittable,
  autobound,
])

const config = {
  storeDecorator,
  onStoreMount(name, store, props) {
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

export const storeViewDecorator = options =>
  decor([
    [
      storeProvidable,
      {
        ...config,
        ...options,
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
  ProxyStore.name = Store.name
  return ProxyStore
}
