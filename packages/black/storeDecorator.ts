// @ts-ignore
import decor, { DecorPlugin } from '@mcro/decor'
import { hydratable, utilityUsable, UtilityUsable } from '@mcro/decor-mobx'
import { subscribable, emittable } from '@mcro/decor-classes'
import automagical from '@mcro/automagical'
import { CompositeDisposable } from 'event-kit'

// import { DecorCompiledDecorator } from '@mcro/decor'
export { DecorPlugin, DecorCompiledDecorator } from '@mcro/decor'

// DecorCompiledDecorator<UtilityUsable>
export const storeDecorator: any = decor([
  subscribable,
  utilityUsable,
  emittable,
  automagical,
  hydratable,
])

export const storeOptions = {
  storeDecorator,
  onStoreMount(_, store, props) {
    if (store._decorated) {
      console.warn('decoarte twice', store, props)
      return
    }
    Object.defineProperty(store, '_decorated', {
      enumerable: false,
      writable: false,
      value: true,
    })
    if (store.automagic) {
      store.automagic()
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
        console.log('dispsoing store', key)
        store[key].subscriptions.dispose()
      }
    }
  },
}

export function store<T>(Store): UtilityUsable & T {
  const DecoratedStore = storeDecorator(Store)
  const ProxyStore = function(...args) {
    // console.log('on store mount', this, args)
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
  // @ts-ignore
  return ProxyStore
}
