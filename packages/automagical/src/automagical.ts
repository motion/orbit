import { CompositeDisposable } from 'event-kit'
import * as Mobx from 'mobx'

// export @react decorator
export { cancel } from './cancel'
export { Reaction, ReactionRejectionError, ReactionTimeoutError } from './constants'
export { ensure } from './ensure'
export { react } from './react'
export * from './types'
export { updateProps } from './updateProps'
export { CurrentComponent, useCurrentComponent } from './useCurrentComponent'
export { useReaction } from './useReaction'

// helpers
// this lets you "always" react to any values you give as arguments without bugs
export const always = ((() => Math.random()) as unknown) as (...args: any[]) => number
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

type AutomagicDecription = {
  getters: Object
  reactions: Object
  subscriptions: CompositeDisposable
  decorations: { [key: string]: 'action' | 'ref' | 'reaction' }
}

export type AutomagicStore<Props> = {
  dispose: Function
  __automagic: AutomagicDecription
}

type Constructable<T> = {
  new (...args: any[]): T
}

export type ConstructedAutomagicStore<T, Props> = {
  new (...args: any[]): T & AutomagicStore<Props>
}

/**
 * Current method: decorate the class before use
 */
export function decorate<T, Props extends Object>(
  obj: Constructable<T>,
  props?: Props,
): ConstructedAutomagicStore<T, Props> {
  if (!obj) {
    throw new Error('No store passed')
  }

  if (!Getters.get(obj)) {
    const getDesc = getterDescriptions(obj)
    Mobx.decorate(obj, getDesc)
    Getters.set(obj, getDesc)
  }

  // allow libraries to detect
  obj.prototype[IS_STORE] = true

  const getterDesc = Getters.get(obj)

  return new Proxy(obj as any, {
    construct(Target, args) {
      // add props to the store and manage them
      const instance = constructWithProps(Target, args, props)
      // create store decoratore with mobx / run all reactions
      return setupAutomagicalClass(instance, getterDesc)
    },
  })
}

// decorates the prototype
export function getterDescriptions(obj: any) {
  const getterDesc = {}
  const decor = {}
  const prototype = Object.getPrototypeOf(obj)
  const descriptors = Object.getOwnPropertyDescriptors(prototype)
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
  return getterDesc
}

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
  Object.defineProperty(Object.getPrototypeOf(Store), 'props', getProps)
  const instance = new Store()
  Object.defineProperty(instance, 'props', getProps)
  return instance
}

export function setupAutomagicalClass(instance: any, getterDesc: Object) {
  const keys = Object.keys(instance)
  const subscriptions = new CompositeDisposable()
  const dispose = () => subscriptions.dispose()
  const instDecor = {}
  const reactions = {}
  const getters = {}
  const decorations = {}

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
}
