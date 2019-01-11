import decor from '@mcro/decor'
import { subscribable, emittable } from '@mcro/decor-classes'
import automagic from '@mcro/automagical'
import { CompositeDisposable } from 'event-kit'

export const storeDecorator: any = decor([emittable, subscribable, automagic])

export const storeOptions = {
  storeDecorator,
  onStoreMount(storeI, props) {
    // TODO make automagical idempotent
    if (!storeI._decorated) {
      Object.defineProperty(storeI, '_decorated', {
        enumerable: false,
        writable: false,
        value: true,
      })
      if (storeI.automagic) {
        storeI.automagic({
          isSubscribable: x => x && typeof x.subscribe === 'function',
        })
      }
    }
    if (storeI.setupSubscribables) {
      storeI.setupSubscribables()
    }
    if (storeI.willMount) {
      storeI.willMount.call(storeI, props)
    }
  },
  onStoreDidMount(storeI, props) {
    if (storeI.didMount && !storeI.__didMounted) {
      storeI.didMount.call(storeI, props)
      storeI.__didMounted = true
    }
  },
  onStoreUnmount(storeI) {
    if (storeI.willUnmount) {
      storeI.willUnmount(storeI)
    }
    if (storeI.subscriptions) {
      storeI.subscriptions.dispose()
    }
    // unmount stores attached to root of stores
    for (const key of Object.keys(storeI)) {
      if (storeI[key] && storeI[key].subscriptions instanceof CompositeDisposable) {
        storeI[key].subscriptions.dispose()
      }
    }
  },
}

export function store<T>(Store: T): any {
  const DecoratedStore = storeDecorator(Store)
  const ProxyStore = function(...args) {
    // console.log('on store mount', this, args)
    const storeI = new DecoratedStore(...args)
    storeOptions.onStoreMount(storeI, args[0])
    return storeI
  }
  // copy statics
  const statics = Object.keys(Store)
  if (statics.length) {
    for (const key of statics) {
      ProxyStore[key] = Store[key]
    }
  }
  return ProxyStore as any
}
