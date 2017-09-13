// @flow
import decor from '@mcro/decor'
import emittable from '@mcro/decor/lib/plugins/core/emittable'
import type { Emittable } from '@mcro/decor/lib/plugins/core/emittable'
import automagical from '@mcro/automagical'
import subscribable from '@mcro/decor/lib/plugins/react/subscribable'
import type { Subscribable } from '@mcro/decor/lib/plugins/react/subscribable'
import helpers from '@mcro/decor/lib/plugins/mobx/helpers'
import type { Helpers } from '@mcro/decor/lib/plugins/mobx/helpers'

export type StoreClass = Emittable & Subscribable & Helpers

export const storeDecorator = decor([
  subscribable,
  helpers,
  emittable,
  automagical,
])

export const storeOptions = {
  storeDecorator,
  onStoreMount(name: string, store: StoreClass, props: Object) {
    if (store.start) {
      store.start.call(store, props)
    }
  },
  onStoreUnmount(store: StoreClass) {
    if (store.stop) {
      store.stop.call(store)
    }
    store.subscriptions.dispose()
  },
}

export default function store(Store: Class<any>): StoreClass {
  const DecoratedStore = storeDecorator(Store)
  const ProxyStore = function(...args) {
    const store = new DecoratedStore(...args)
    storeOptions.onStoreMount(Store.constructor.name, store, args[0])
    return store
  }
  return ProxyStore
}
