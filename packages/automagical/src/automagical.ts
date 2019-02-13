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

const FILTER_KEYS = {
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

  const protoDecorations = {}
  const descriptors = Object.getOwnPropertyDescriptors(obj.prototype)
  for (const key in descriptors) {
    if (FILTER_KEYS[key] || key[0] === '_') continue
    const descriptor = descriptors[key]
    if (descriptor && (!!descriptor.get || !!descriptor.set)) {
      protoDecorations[key] = Mobx.computed
    }
    if (typeof descriptor.value === 'function') {
      protoDecorations[key] = Mobx.action
    }
  }
  Mobx.decorate(obj, protoDecorations)

  // decorate instance values and react() functions

  return new Proxy(obj as any, {
    construct(Target, args) {
      const instance = new Target(args)
      instance.__automagicSubscriptions = new CompositeDisposable()
      const instDecorations = {}
      const reactions = {}

      for (const key of Object.keys(instance)) {
        if (FILTER_KEYS[key]) continue
        const value = instance[key]
        if (typeof value === 'function') {
          if (value.isAutomagicReaction) {
            reactions[key] = value(instance, key)
            Object.defineProperty(instance, key, {
              enumerable: true,
              get() {
                return reactions[key].get()
              },
            })
          } else {
            instDecorations[key] = Mobx.action
          }
        } else {
          instDecorations[key] = Mobx.observable.ref
        }
      }

      const res = Mobx.decorate(instance, instDecorations)

      return res
    },
  })
}
