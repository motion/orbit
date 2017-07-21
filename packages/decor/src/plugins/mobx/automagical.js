// @flow
import { fromStream, fromPromise } from 'mobx-utils'
import * as Mobx from 'mobx'

if (module.hot) {
  module.hot.accept(() => {
    console.log('please manually refresh')
  })
}

const isObservable = x => {
  try {
    return x && (x.isObservable || Mobx.isObservable(x))
  } catch (e) {
    console.log('mobxer', e)
    return x && x.observersIndexes
  }
}
const isFunction = val => typeof val === 'function'
const isQuery = val => val && val.$isQuery
const isRxObservable = val => window.Rx && val instanceof window.Rx.Observable
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

function mobxifyQuery(obj, method, val) {
  Object.defineProperty(obj, method, {
    get() {
      return val.current // hit observable
    },
  })
  obj.subscriptions.add(val)
  return val
}

function mobxifyPromise(obj, method, val) {
  const observable = fromPromise(val)
  Object.defineProperty(obj, method, {
    get() {
      return observable.value
    },
  })
}

// TODO use rxdb api
function isRxDbQuery(query) {
  return query && query.mquery
}

function mobxifyRxObservable(obj, method, val) {
  const stream = fromStream(val || obj[method])
  Mobx.extendShallowObservable(obj, { [method]: stream })
  obj.subscriptions.add(stream)
}

function automagic(obj: Object) {
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

  // mutate to be mobx observables
  for (const method of Object.keys(descriptors)) {
    mobxify(obj, method, descriptors)
  }
}

// * => mobx
function mobxify(target: Object, method: string, descriptors: Object) {
  const descriptor = descriptors && descriptors[method]

  // check first to avoid accidental get
  if (descriptor && !!descriptor.get) {
    const getter = {
      [method]: null,
    }
    Object.defineProperty(getter, method, descriptor)
    // @computed get
    Mobx.extendObservable(target, getter)
    return
  }

  let value = target[method]

  // let it be
  if (isObservable(value)) {
    return value
  }
  // @watch: autorun |> automagical (value)
  if (isWatch(value)) {
    return mobxifyWatch(target, method, value)
  }
  if (isPromise(value)) {
    mobxifyPromise(target, method, value)
    return
  }
  if (isQuery(value)) {
    mobxifyQuery(target, method, value)
    return
  }
  if (isRxObservable(value)) {
    mobxifyRxObservable(target, method)
    return
  }
  if (isRxDbQuery(value)) {
    const watchedMethod = `__${method}_stream`
    target[watchedMethod] = target[method].$
    mobxifyRxObservable(target, watchedMethod)
    Object.defineProperty(target, method, {
      get() {
        return target[watchedMethod].current
      },
    })
    return
  }
  if (isFunction(value)) {
    // @action
    const targetMethod = target[method].bind(target)
    const NAME = `${target.constructor.name}.${method}`
    const logWrappedMethod = (...args) => {
      if (window.log && window.log.debug) {
        if (window.log.filter && window.log.filter.test(NAME)) {
          console.log(NAME, ...args)
        }
      }
      return targetMethod(...args)
    }

    target[method] = Mobx.action(NAME, logWrappedMethod)
    return target[method]
  }
  // @observable.ref
  Mobx.extendShallowObservable(target, { [method]: value })
  return value
}

// * => Mobx
function resolve(value) {
  if (isRxObservable(value)) {
    const stream = fromStream(value)
    return {
      get: () => stream.current,
      dispose: stream.dispose,
      isObservable: true,
    }
  }
  return value
}

// watches values in an autorun, and resolves their results
function mobxifyWatch(obj, method, val) {
  let id = Math.random()
  const KEY = `${obj.constructor.name}.${method}--${id}--`
  let current = Mobx.observable.box(null)
  let currentDisposable = null
  let currentObservable = null
  let stopObservableAutorun

  const update = val => {
    current.set(Mobx.observable.box(val))
  }

  function runObservable() {
    stopObservableAutorun && stopObservableAutorun()
    stopObservableAutorun = Mobx.autorun(() => {
      if (currentObservable) {
        if (method === 'children') {
          console.log('got', currentObservable)
        }
        const value = currentObservable.get()
        update(value) // set + wrap
      }
    })
  }

  const stopAutorun = Mobx.autorun(watchForNewValue)

  async function watchForNewValue() {
    const result = resolve(val.call(obj, obj.props)) // hit user observables // pass in props
    stopObservableAutorun && stopObservableAutorun()
    if (currentDisposable) {
      currentDisposable()
      currentDisposable = null
    }
    if (result && result.dispose) {
      currentDisposable = result.dispose.bind(result)
    }
    if (result && (isQuery(result) || isObservable(result))) {
      if (result.isntConnected) {
        return
      }
      currentObservable = result
      runObservable()
    } else if (isPromise(result)) {
      current.set(fromPromise(result))
    } else {
      update(result)
    }
  }

  Object.defineProperty(obj, method, {
    get() {
      const result = current.get()
      if (result && result.promise) {
        return result.value
      }
      if (isObservable(result)) {
        if (Mobx.isObservableArray(result) || Mobx.isObservableMap(result)) {
          return Mobx.toJS(result)
        }
        return result.get()
      }
      return result
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
