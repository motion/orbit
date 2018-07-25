import decor from '@mcro/decor'
import { hydratable } from '@mcro/decor-mobx'
import { subscribable } from '@mcro/decor-classes'
import automagical from '@mcro/automagical'
import { CompositeDisposable } from 'event-kit'

// import { DecorCompiledDecorator } from '@mcro/decor'
export { DecorPlugin, DecorCompiledDecorator } from '@mcro/decor'
export { on } from '@mcro/helpers'

export const storeDecorator: any = decor([
  subscribable,
  automagical,
  hydratable,
])

export const storeOptions = {
  storeDecorator,
  onStoreMount(store, props) {
    // TODO make automagical idempotent
    if (!store._decorated) {
      Object.defineProperty(store, '_decorated', {
        enumerable: false,
        writable: false,
        value: true,
      })
      if (store.automagic) {
        store.automagic()
      }
    }
    if (store.setupSubscribables) {
      store.setupSubscribables()
    }
    if (store.willMount) {
      store.willMount.call(store, props)
    }
  },
  onStoreDidMount(store, props) {
    if (store.didMount) {
      store.didMount.call(store, props)
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
        store[key].subscriptions.dispose()
      }
    }
  },
}

export function store<T>(Store): T {
  const DecoratedStore = storeDecorator(Store)
  const ProxyStore = function(...args) {
    // console.log('on store mount', this, args)
    const store = new DecoratedStore(...args)
    storeOptions.onStoreMount(store, args[0])
    return store
  }
  // copy statics
  const statics = Object.keys(Store)
  if (statics.length) {
    for (const key of statics) {
      ProxyStore[key] = Store[key]
    }
  }
  // @ts-ignore
  return ProxyStore
}
