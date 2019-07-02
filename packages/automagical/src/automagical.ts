import { CompositeDisposable } from 'event-kit'
import * as Mobx from 'mobx'

import { updateProps } from './updateProps'

// export @react decorator
export { cancel } from './cancel'
export { Reaction, ReactionRejectionError, ReactionTimeoutError } from './constants'
export { ensure } from './ensure'
export { react } from './react'
export * from './types'
export { updateProps } from './updateProps'
export { CurrentComponent, useCurrentComponent } from './useCurrentComponent'
export { useReaction } from './useReaction'

// this lets you "always" react to any values you give as arguments without bugs
type AlwaysReactFn = (...args: any[]) => number

export const always = (((obj: any) => {
  if (Mobx.isObservableObject(obj)) {
    // watch all values (shallowly) of an object
    for (const k in obj) obj[k]
  }
  return Math.random()
}) as unknown) as AlwaysReactFn
export const IS_STORE = Symbol('IS_STORE')

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

function constructWithProps(Store: any, args: any[], props?: Object) {
  if (!props) {
    return new Store(...args)
  }
  const storeProps = Mobx.observable(
    { props },
    { props: Mobx.observable.shallow },
    { name: Store.name },
  )
  const getProps = {
    configurable: true,
    get: () => storeProps.props,
    set() {},
  }
  Object.defineProperty(Store.prototype, 'props', getProps)
  const instance = new Store()
  Object.defineProperty(instance, 'props', getProps)
  return instance
}

type AutomagicDecription = {
  getters: Object
  reactions: Object
  subscriptions: CompositeDisposable
  decorations: { [key: string]: 'action' | 'ref' | 'reaction' }
}

export type AutomagicStore<Props> = {
  setProps: (props: Partial<Props>) => any
  dispose: Function
  __automagic: AutomagicDecription
}

// decorates the prototype
function decoratePrototype(obj: any) {
  const getterDesc = {}
  const decor = {}
  const descriptors = Object.getOwnPropertyDescriptors(obj.prototype)
  for (const key in descriptors) {
    if (IGNORE[key] || key[0] === '_') continue
    const descriptor = descriptors[key]
    if (descriptor && !!descriptor.get) {
      getterDesc[key] = descriptor
    }
    if (typeof descriptor.value === 'function') {
      // only make `set` prefixed functions into actions
      if (key.indexOf('set') === 0) {
        decor[key] = Mobx.action
      }
    }
  }
  Mobx.decorate(obj, decor)
  return getterDesc
}

export function decorate<T, Props extends Object>(
  obj: {
    new (...args: any[]): T
  },
  props?: Props,
): { new (...args: any[]): T & AutomagicStore<Props> } {
  if (!obj) {
    throw new Error('No store passed')
  }
  if (!Getters.get(obj)) {
    Getters.set(obj, decoratePrototype(obj))
  }

  // allow libraries to detect
  obj.prototype[IS_STORE] = true

  const getterDesc = Getters.get(obj)

  return new Proxy(obj as any, {
    construct(Target, args) {
      // add props to the store and manage them
      const instance = constructWithProps(Target, args, props)
      const keys = Object.keys(instance)
      const subscriptions = new CompositeDisposable()
      const dispose = () => subscriptions.dispose()
      const instDecor = {}
      const reactions = {}
      const getters = {}
      const decorations = {}

      Object.defineProperty(instance, 'setProps', {
        enumerable: false,
        value: function setProps(next: Object) {
          if (next) {
            updateProps(instance, next)
          }
        },
      })

      const ogDispose = instance.dispose && instance.dispose.bind(instance)
      Object.defineProperty(instance, 'dispose', {
        enumerable: true,
        value: () => {
          ogDispose && ogDispose()
          dispose()
        },
      })

      Object.defineProperty(instance, '__automagic', {
        enumerable: false,
        get: (): AutomagicDecription => ({
          getters,
          reactions,
          subscriptions,
          decorations,
        }),
      })

      for (const key of keys) {
        if (IGNORE[key]) continue
        const value = instance[key]
        if (Mobx.isObservable(value)) continue
        if (typeof value === 'function') {
          if (value.isAutomagicReaction) {
            delete instance[key]
            reactions[key] = {
              initializer: value,
              value: null,
            }
            decorations[key] = 'reaction'
            const val = value.reactionOptions ? value.reactionOptions.defaultValue : null
            instance[key] = val
            instDecor[key] = Mobx.observable.ref
          } else {
            if (key.indexOf('set') == 0) {
              instDecor[key] = Mobx.action
              decorations[key] = 'action'
            }
          }
          continue
        }
        instDecor[key] = Mobx.observable.ref
        decorations[key] = 'ref'
      }

      const decoratedInstance = Mobx.decorate(instance, instDecor)

      for (const key in getterDesc) {
        getters[key] = Mobx.computed(getterDesc[key].get.bind(decoratedInstance))
        Object.defineProperty(instance, key, {
          enumerable: true,
          get() {
            return getters[key].get()
          },
          set: getterDesc[key].set,
        })
      }

      for (const key in reactions) {
        reactions[key].value = reactions[key].initializer(decoratedInstance, key)
      }

      return decoratedInstance
    },
  })
}
