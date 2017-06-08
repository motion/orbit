import { fromPromise } from 'mobx-utils'
import { Observable } from 'rxjs'
import {
  action,
  isObservable,
  extendShallowObservable,
  extendObservable,
  autorun,
} from 'mobx'

export default function automagical(options) {
  return {
    decorator: Klass => {
      if (!Klass.prototype) {
        return Klass
      }

      class ProxyClass extends Klass {
        constructor(...args) {
          super(...args)
          automagic(this)
        }
      }

      return ProxyClass
    },
  }
}

const isAutorun = val => val && val.autorunme
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

function observableRxToObservableMobx(obj, method) {
  extendShallowObservable(obj, { [method]: fromStream(obj[method]) })
  return obj[method]
}

function automagic(obj) {
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

// mutative
function automagicalValue(obj, method, descriptors = {}) {
  if (/^(\$mobx|subscriptions|props|\_.*)$/.test(method)) {
    return
  }

  // auto @computed get, do this before getting val
  const descriptor = descriptors[method]
  if (descriptor && typeof descriptor.get) {
    const getter = {
      [method]: null,
    }
    Object.defineProperty(getter, method, descriptor)
    extendObservable(obj, getter)
    return
  }

  // not get, we can check value
  let val = obj[method]

  // auto run autoruns ;)
  if (isAutorun(val)) {
    extendShallowObservable(obj, { [method]: null })
    const autorunner = autorun(() => {
      const previous = obj[method]
      obj[method] = val()
      automagicalValue(obj, method)
      // unsubscribe from previous
      if (previous && previous !== null) {
        // hacky, remove old listener, should be done nicer
        if (typeof previous === 'function') {
          previous()
        }
        if (typeof previous.dispose === 'function') {
          previous.dispose()
        }
        if (typeof previous.remove === 'function') {
          previous.remove()
        }
      }
      // need to run this to ensure it wraps autorun value magically
    })
    obj.subscriptions.add(autorunner)
    return
  }

  // auto resolve promise
  if (val instanceof Promise) {
    const observable = fromPromise(val)
    Object.defineProperty(obj, method, {
      get() {
        return observable.value
      },
    })
    // TODO: make a query that contains a promsie work
    return
  }

  const isFunction = typeof val === 'function'
  const isQuery = val && val.$isQuery

  // auto @query => observable
  if (isQuery) {
    Object.defineProperty(obj, method, {
      get() {
        return val.current
      },
    })
    obj.subscriptions.add(val)
    return
  }

  // if already Mobx observable, just let it be yo
  if (isObservable(val)) {
    return
  }

  // auto Rx => mobx
  if (val instanceof Observable) {
    const observable = observableRxToObservableMobx(obj, method)
    obj.subscriptions.add(observable)
    return
  }

  // auto actions
  if (isFunction) {
    // @action functions
    obj[method] = action(
      `${obj.constructor.name}.${obj.id ? `${obj.id}.` : ''}${method}`,
      obj[method]
    )
  } else {
    // auto everything is an @observable.ref
    extendShallowObservable(obj, { [method]: val })
  }
}
