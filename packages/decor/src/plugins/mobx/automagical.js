// @flow
import { fromStream, fromPromise } from 'mobx-utils'
import { Observable } from 'rxjs'
import {
  action,
  isObservable,
  extendShallowObservable,
  extendObservable,
  autorun,
} from 'mobx'

export default function automagical(options: Object) {
  return {
    decorator: (Klass: Class<any> | Function) => {
      if (!Klass.prototype) {
        return Klass
      }

      class ProxyClass extends Klass {
        static get name() {
          return Klass.name
        }

        constructor(...args) {
          super(...args)
          automagic(this)
        }
      }

      return ProxyClass
    },
  }
}

const isAutorun = (val: any) => val && val.autorunme
const FILTER_KEYS = {
  dispose: true,
  constructor: true,
  start: true,
  react: true,
  ref: true,
  setInterval: true,
  setTimeout: true,
  addEvent: true,
  watch: true,
  props: true,
}

function observableRxToObservableMobx(obj: Object, method: string) {
  extendShallowObservable(obj, { [method]: fromStream(obj[method]) })
  return obj[method]
}

function automagic(obj: Object) {
  // automagic observables
  const proto = Object.getPrototypeOf(obj)
  const fproto = Object.getOwnPropertyNames(proto).filter(
    x => !FILTER_KEYS[x] && x[0] !== '_'
  )

  const descriptors = {
    ...Object.getOwnPropertyDescriptors(obj),
    // gets the getters
    ...fproto.reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: Object.getOwnPropertyDescriptor(proto, cur),
      }),
      {}
    ),
  }

  // mutate objects to be magical
  for (const method of Object.keys(descriptors)) {
    automagicalValue(obj, method, descriptors)
  }
}

// * => Mobx
function automagicalValue(obj: Object, method: string, descriptors = {}) {
  if (/^(\$mobx|subscriptions|props|\_.*)$/.test(method)) {
    return
  }

  // get => @computed
  const descriptor = descriptors[method]
  if (descriptor && !!descriptor.get) {
    const getter = {
      [method]: null,
    }
    Object.defineProperty(getter, method, descriptor)
    extendObservable(obj, getter)
    return
  }

  // not get, we can check value
  let val = obj[method]

  // watch() => autorun(automagical(value))
  if (isAutorun(val)) {
    // @observable.ref
    extendShallowObservable(obj, { [method]: null })
    const autorunner = autorun(() => {
      const previous = obj[method]
      obj[method] = val.call(obj)
      console.log(`${obj.name || ''}${method} = watch((...`)
      automagicalValue(obj, method)
      // unsubscribe from previous
      if (previous && previous !== null) {
        log('prev', previous)
        // auto dispose last thing
        if (typeof previous.dispose === 'function') {
          previous.dispose()
        }
        if (typeof previous.cancel === 'function') {
          previous.cancel()
        }
      }
      // need to run this to ensure it wraps autorun value magically
    })
    obj.subscriptions.add(autorunner)
    return
  }

  // Promise => Mobx
  if (val instanceof Promise) {
    const observable = fromPromise(val)
    Object.defineProperty(obj, method, {
      get() {
        return observable.value
      },
    })
    // TODO: make a query that contains a promise work
    return
  }

  const isFunction = typeof val === 'function'
  const isQuery = val && val.$isQuery

  // @query => Mobx
  if (isQuery) {
    Object.defineProperty(obj, method, {
      get() {
        return val.current
      },
    })
    obj.subscriptions.add(val)
    return
  }

  // already Mobx observable, let it be yo
  if (isObservable(val)) {
    return
  }

  // Rx => mobx
  if (val instanceof Observable) {
    const observable = observableRxToObservableMobx(obj, method)
    obj.subscriptions.add(observable)
    return
  }

  if (isFunction) {
    // @action
    obj[method] = action(`${obj.constructor.name}.${method}`, obj[method])
  } else {
    // @observable.ref
    extendShallowObservable(obj, { [method]: val })
  }
}
