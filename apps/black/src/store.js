// @flow
import decor from '@jot/decor'
import autobound from '@jot/decor/lib/plugins/core/autobound'
import emittable, { Emittable } from '@jot/decor/lib/plugins/core/emittable'
import automagical from '@jot/decor/lib/plugins/mobx/automagical'
import subscribable, { Subscribable } from '@jot/decor/lib/plugins/react/subscribable'
import subscribableHelpers, { SubscribableHelpers } from '@jot/decor/lib/plugins/core/subscribableHelpers'

export type StoreClass = Emittable & Subscribable & SubscribableHelpers

export const storeDecorator = decor([
  subscribable,
  subscribableHelpers,
  emittable,
  automagical,
  autobound,
])

export const storeOptions = {
  storeDecorator,
  onStoreMount(store, props) {
    if (store.start) {
      store.start(props)
    }
  },
  onStoreUnmount(store) {
    if (store.stop) {
      store.stop()
    }
    store.subscriptions.dispose()
  },
}

export default function store(Store): StoreClass {
  const DecoratedStore = storeDecorator(Store)
  const ProxyStore = function(...args) {
    const store = new DecoratedStore(...args)
    storeOptions.onStoreMount(Store.constructor.name, store, args[0])
    return store
  }
  return ProxyStore
}
