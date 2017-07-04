// @flow
import { fromStream, fromPromise } from 'mobx-utils'
import { Observable } from 'rxjs'
import {
  observable,
  action,
  isObservable,
  extendShallowObservable,
  extendObservable,
  toJS,
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

const isWatch = (val: any) => val && val.IS_AUTO_RUN
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

const DEFAULT_OPTS = {
  extendPlainValues: true,
  extendFunctions: true,
}

type Disposable = { dispose: Function }

function rxToMobx(obj: Object, method: string): Disposable {
  extendShallowObservable(obj, { [method]: fromStream(obj[method]) })
  return obj[method]
}

function wrapQuery(obj, method, val) {
  Object.defineProperty(obj, method, {
    get() {
      return val.current // hit observable
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
  const observable = rxToMobx(obj, method)
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
    automagicalValue(obj, method, { descriptors, ...DEFAULT_OPTS })
  }
}

// * => Mobx
function automagicalValue(
  obj: Object,
  method: string,
  options: Object = DEFAULT_OPTS
) {
  // get => @computed
  const descriptor = options.descriptors && options.descriptors[method]
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

  // already Mobx observable, let it be yo
  try {
    if (isObservable(val)) {
      return val
    }
  } catch (e) {
    console.error('error getting obs for val', val)
    throw e
  }

  // watch() => autorun(automagical(value))
  if (isWatch(val)) {
    return wrapWatch(obj, method, val)
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
  if (options.extendFunctions && isFunction(val)) {
    // @action
    obj[method] = action(`${obj.constructor.name}.${method}`, obj[method])
    return obj[method]
  }
  // @observable.ref
  if (options.extendPlainValues) {
    extendShallowObservable(obj, { [method]: val })
  }

  return val
}

// * => Mobx
function resolve(value) {
  if (isRxObservable(value)) {
    return fromStream(value) // .current & .dispose
  }
  return value
}

// watches values in an autorun, and resolves their results
function wrapWatch(obj, method, val) {
  let current = observable.box(null)
  let currentDisposable = null
  let currentObservable = null
  let uid = 0
  let stopObservableAutorun

  function runObservable() {
    stopObservableAutorun && stopObservableAutorun()
    stopObservableAutorun = autorun(() => {
      if (currentObservable) {
        current.set(currentObservable.current) // hit observable
      }
    })
  }

  const stopAutorun = autorun(async () => {
    let mid = ++uid // lock
    const result = resolve(val.call(obj)) // hit user observables
    stopObservableAutorun && stopObservableAutorun()
    if (currentDisposable) {
      currentDisposable()
      currentDisposable = null
    }
    if (result && result.dispose) {
      currentDisposable = result.dispose
    }
    if (result && (result.$isQuery || isObservable(result))) {
      currentObservable = result
      runObservable()
    } else {
      if (isPromise(result)) {
        const value = await result
        if (uid === mid) {
          // if lock still valid
          current.set(value)
        }
      } else {
        current.set(result)
      }
    }
  })
  Object.defineProperty(obj, method, {
    get() {
      return toJS(current.get())
    },
  })
  obj.subscriptions.add(() => {
    if (currentDisposable) {
      currentDisposable()
    }
    stopAutorun()
    stopObservableAutorun && stopObservableAutorun()
  })
  return current
}
