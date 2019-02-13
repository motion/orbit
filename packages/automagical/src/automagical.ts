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

const Getters = new WeakMap()

// decorates the prototype
function decorateStore(obj) {
  Object.defineProperty(obj.prototype, 'disposeAutomagic', {
    enumerable: false,
    configurable: false,
    get() {
      return () => {
        this.__automagicSubscriptions.dispose()
      }
    },
  })

  const getterDesc = {}
  const decor = {}
  const descriptors = Object.getOwnPropertyDescriptors(obj.prototype)
  for (const key in descriptors) {
    if (IGNORE[key] || key[0] === '_') continue
    const descriptor = descriptors[key]
    if (descriptor && !!descriptor.get) {
      getterDesc[key] = descriptor.get
    }
    if (typeof descriptor.value === 'function') {
      decor[key] = Mobx.action
    }
  }
  Mobx.decorate(obj, decor)
  return getterDesc
}

export function decorate<T>(obj: {
  new (...args: any[]): T
}): { new (...args: any[]): T & { dispose: Function } } {
  if (!Getters.get(obj)) {
    const getters = decorateStore(obj)
    Getters.set(obj, getters)
  }

  const getterDesc = Getters.get(obj)

  return new Proxy(obj as any, {
    construct(Target, args) {
      const instance = new Target(...args)
      const keys = Object.keys(instance)
      instance.__automagicSubscriptions = new CompositeDisposable()
      const instDecor = {}
      const reactions = {}
      const getters = {}

      for (const key in getterDesc) {
        Object.defineProperty(instance, key, {
          enumerable: true,
          get() {
            if (!getters[key]) {
              getters[key] = Mobx.computed(getterDesc[key].bind(decoratedInstance))
            }
            return getters[key].get()
          },
        })
      }

      for (const key of keys) {
        if (IGNORE[key]) continue
        const value = instance[key]
        if (typeof value === 'function') {
          if (value.isAutomagicReaction) {
            delete instance[key]
            reactions[key] = {
              initializer: value,
              value: null,
            }
            Object.defineProperty(instance, key, {
              enumerable: true,
              get() {
                const r = reactions[key]
                if (!r.value) {
                  r.value = r.initializer(decoratedInstance, key)
                }
                return r.value.get()
              },
            })
          } else {
            instDecor[key] = Mobx.action
          }
        } else {
          instDecor[key] = Mobx.observable.ref
        }
      }

      const decoratedInstance = Mobx.decorate(instance, instDecor)

      return decoratedInstance
    },
  })
}
