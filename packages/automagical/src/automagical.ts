import { CompositeDisposable } from 'event-kit'
import * as Mobx from 'mobx'

// export @react decorator
export { cancel } from './cancel'
export { Reaction, ReactionRejectionError, ReactionTimeoutError } from './constants'
export { ensure } from './ensure'
export { react } from './react'
export * from './types'

// this lets you "always" react to any values you give as arguments without bugs
export const always = ((() => Math.random()) as unknown) as (...args: any[]) => number

const IGNORE = {
  props: true,
}

export let automagicConfig = {
  isSubscribable: x => x && typeof x.subscribe === 'function',
}
export function configureAutomagical(opts: { isSubscribable?: (val: any) => boolean }) {
  automagicConfig = Object.freeze(Object.assign(automagicConfig, opts))
}

export function dispose(store: any) {
  if (store.__automagicSubscriptions) {
    console.log('dispsing2..')
    store.__automagicSubscriptions.dispose()
  }
}

export function decorate<A extends any>(obj: A): A {
  if (obj.prototype.__hasAutomagic) {
    return obj
  }
  Object.defineProperty(obj.prototype, '__hasAutomagic', {
    enumerable: false,
    configurable: false,
    value: true,
  })

  // decorate prototype first
  const getters = {}
  const decor = {}
  const descriptors = Object.getOwnPropertyDescriptors(obj.prototype)
  for (const key in descriptors) {
    if (IGNORE[key] || key[0] === '_') continue
    const descriptor = descriptors[key]
    if (descriptor && !!descriptor.get) {
      getters[key] = {
        initializer: function() {
          return Mobx.computed(descriptor.get.bind(this))
        },
        value: null,
      }
    }
    if (typeof descriptor.value === 'function') {
      decor[key] = Mobx.action
    }
  }
  Mobx.decorate(obj, decor)

  // decorate instance values and react() functions

  return new Proxy(obj as any, {
    construct(Target, args) {
      const instance = new Target(...args)
      const keys = Object.keys(instance)
      instance.__automagicSubscriptions = new CompositeDisposable()
      const instDecor = {}
      const reactions = {}

      for (const key of keys) {
        if (IGNORE[key]) continue
        if (getters[key]) continue
        const value = instance[key]
        if (typeof value === 'function') {
          if (value.isAutomagicReaction) {
            delete instance[key]
            Object.defineProperty(instance, key, {
              get() {
                const r = reactions[key]
                if (!r.value) r.value = r.initializer(proxiedStore, key)
                return r.value.get()
              },
            })
            reactions[key] = {
              initializer: value,
              value: null,
            }
          } else {
            instDecor[key] = Mobx.action
          }
        } else {
          instDecor[key] = Mobx.observable.ref
        }
      }

      const decoratedInstance = Mobx.decorate(instance, instDecor)

      const proxiedStore = new Proxy(decoratedInstance, {
        get(target, method) {
          if (method !== 'constructor') {
            const g = getters[method]
            if (g) {
              if (!g.value) g.value = g.initializer.call(proxiedStore)
              return g.value.get()
            }
          }
          if (Reflect.has(target, method)) {
            return Reflect.get(target, method)
          }
        },
      })

      return proxiedStore
    },
  })
}
