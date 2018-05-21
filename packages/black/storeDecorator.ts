import decor from '@mcro/decor'
import { hydratable, reactable } from '@mcro/decor-mobx'
import { subscribable, emittable } from '@mcro/decor-classes'
import automagical from '@mcro/automagical'
import { CompositeDisposable } from 'sb-event-kit'

export const storeDecorator = decor([
  subscribable,
  reactable,
  emittable,
  automagical,
  hydratable,
])

export const storeOptions = {
  storeDecorator,
  onStoreMount(_, store, props) {
    if (store.automagic) {
      store.automagic()
    }
    if (store.willMount) {
      store.willMount.call(store, props)
    }
  },
  onStoreUnmount(store) {
    if (store.willUnmount) {
      store.willUnmount(store)
    }
    if (store.subscriptions) {
      store.subscriptions.dispose()
    }
    // unmount stores attached to root of stores
    for (const key of Object.keys(store)) {
      if (
        store[key] &&
        store[key].subscriptions instanceof CompositeDisposable
      ) {
        console.log('dispsoing store', key)
        store[key].subscriptions.dispose()
      }
    }
  },
}

export function store(Store) {
  const DecoratedStore = storeDecorator(Store)
  const ProxyStore = function(...args) {
    const store = new DecoratedStore(...args)
    storeOptions.onStoreMount(Store.constructor.name, store, args[0])
    return store
  }
  // copy statics
  const statics = Object.keys(Store)
  if (statics.length) {
    for (const key of statics) {
      ProxyStore[key] = Store[key]
    }
  }
  return ProxyStore
}
