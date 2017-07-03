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

const isFunction = val => typeof val === 'function'
const isQuery = val => val && val.$isQuery
const isRxObservable = val => val instanceof Observable
const isPromise = val => val instanceof Promise

export default function automagical() {
  return {
    name: 'automagical',
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

const isWatch = (val: any) => val && val.autorunme
const FILTER_KEYS = {
  dispose: true,
  constructor: true,
  start: true,
  stop: true,
  react: true,
  ref: true,
  setInterval: true,
  setTimeout: true,
  addEvent: true,
  watch: true,
  props: true,
  context: true,
  componentWillMount: true,
  componentDidMount: true,
  render: true,
  componentWillReceiveProps: true,
  shouldComponentUpdate: true,
  componentDidUpdate: true,
  componentWillUnmount: true,
}

function observableRxToObservableMobx(obj: Object, method: string) {
  extendShallowObservable(obj, { [method]: fromStream(obj[method]) })
  return obj[method]
}

function wrapQuery(obj, method, val) {
  Object.defineProperty(obj, method, {
    get() {
      return val.current
    },
  })
  obj.subscriptions.add(val)
  return val
}

function wrapPromise(obj, method, val) {
  const observable = fromPromise(val)
  Object.defineProperty(obj, method, {
    get() {
      return observable.value
    },
  })
}

function wrapRxObservable(obj, method) {
  const observable = observableRxToObservableMobx(obj, method)
  obj.subscriptions.add(observable)
  return observable
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
    automagicalValue(obj, method, { descriptors })
  }
}

// * => Mobx
function automagicalValue(
  obj: Object,
  method: string,
  { descriptors, extendPlainValues = true, extendFunctions = true } = {}
) {
  if (/^(\$mobx|subscriptions|props|\_.*)$/.test(method)) {
    return
  }

  // get => @computed
  const descriptor = descriptors && descriptors[method]
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
  if (isWatch(val)) {
    // @observable.ref
    extendShallowObservable(obj, { [method]: null })
    let previous
    const stop = autorun(() => {
      if (method === 'currentDocument') {
        console.log(val, obj)
      }

      obj[method] = val.call(obj)
      if (method === 'currentDocument') {
        console.log(val, obj)
        console.log(
          `watch.autorun ${obj.name || obj.constructor.name}.${method}`,
          obj[method]
        )
      }
      // auto dispose the previous thing
      if (previous && previous !== null && previous.dispose) {
        previous.dispose()
      }
      // wrap new value so we auto handle returned promises and such
      previous = automagicalValue(obj, method, {
        extendPlainValues: false,
        extendFunctions: false,
      })
    })
    obj.subscriptions.add(() => {
      if (previous && previous !== null && previous.dispose) {
        previous.dispose()
      }
      stop()
    })
    return
  }

  // already Mobx observable, let it be yo
  if (isObservable(val)) {
    return null
  }
  // Promise => Mobx
  if (isPromise(val)) {
    return wrapPromise(obj, method, val)
  }
  // @query => Mobx
  if (isQuery(val)) {
    return wrapQuery(obj, method, val)
  }
  // Rx => mobx
  if (isRxObservable(val)) {
    return wrapRxObservable(obj, method)
  }
  // else
  if (extendFunctions && isFunction(val)) {
    // @action
    obj[method] = action(`${obj.constructor.name}.${method}`, obj[method])
    return
  }
  if (extendPlainValues) {
    // @observable.ref
    extendShallowObservable(obj, { [method]: val })
  }
  return null
}
