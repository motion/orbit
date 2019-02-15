import { CompositeDisposable } from 'event-kit'
import * as Mobx from 'mobx'

// export @react decorator
export { cancel } from './cancel'
export { Reaction, ReactionRejectionError, ReactionTimeoutError } from './constants'
export { ensure } from './ensure'
export { react } from './react'
export * from './types'
export { updateProps } from './updateProps'

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

// decorates the prototype
function decoratePrototype(obj) {
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
      decor[key] = Mobx.action
    }
  }
  Mobx.decorate(obj, decor)
  return getterDesc
}

function constructWithProps(Store: any, args: any[], props?: Object) {
  if (!props) {
    return new Store(...args)
  }
  const storeProps = Mobx.observable({ props }, { props: Mobx.observable.shallow })
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

export function decorate<T>(
  obj: {
    new (...args: any[]): T
  },
  props?: Object,
): { new (...args: any[]): T & { dispose: Function } } {
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
      instance.__automagicSubscriptions = new CompositeDisposable()
      instance.disposeAutomagic = () => instance.__automagicSubscriptions.dispose()
      const instDecor = {}
      const reactions = {}
      const getters = {}

      for (const key in getterDesc) {
        Object.defineProperty(instance, key, {
          enumerable: true,
          get() {
            if (!getters[key]) {
              getters[key] = Mobx.computed(getterDesc[key].get.bind(decoratedInstance))
            }
            return getters[key].get()
          },
          set: getterDesc[key].set,
        })
      }

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
            Object.defineProperty(instance, key, {
              enumerable: true,
              get() {
                return reactions[key].value.get()
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

      for (const key in reactions) {
        reactions[key].value = reactions[key].initializer(decoratedInstance, key)
      }

      // if (Target.name === 'SubPaneStore' && reactions['isActive'].value.get() === undefined)
      //   debugger

      return decoratedInstance
    },
  })
}
