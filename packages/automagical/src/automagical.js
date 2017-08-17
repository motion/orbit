// @flow
import { fromStream, fromPromise } from 'mobx-utils'
import * as Mobx from 'mobx'
import { Observable } from 'rxjs'

if (module && module.hot && module.hot.accept) {
  module.hot.accept(() => {})
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
const isRxObservable = val => val instanceof Observable
const isPromise = val => val instanceof Promise
const isWatch = (val: any) => val && val.IS_AUTO_RUN
const isObservableLike = val =>
  val && (isQuery(val) || isObservable(val) || val.isObservable)

const DEFAULT_VALUE = undefined

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

const FILTER_KEYS = {
  addEvent: true,
  componentDidMount: true,
  componentDidUpdate: true,
  componentWillMount: true,
  componentWillReceiveProps: true,
  componentWillUnmount: true,
  constructor: true,
  context: true,
  dispose: true,
  props: true,
  react: true,
  ref: true,
  render: true,
  setInterval: true,
  setTimeout: true,
  shouldComponentUpdate: true,
  start: true,
  stop: true,
  subscriptions: true,
  watch: true,
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
      [method]: DEFAULT_VALUE,
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
  // convert RxQuery to RxObservable
  if (isRxDbQuery(value)) {
    value = value.$
  }
  if (isRxObservable(value)) {
    const observable = value
    const mobxStream = fromStream(value)
    return {
      get: () => mobxStream.current,
      mobxStream,
      observable,
      dispose: mobxStream.dispose,
      isObservable: true,
    }
  }
  return value
}

const AID = '__AUTOMAGICAL_ID__'
const uid = () => `__ID_${Math.random()}__`

// watches values in an autorun, and resolves their results
function mobxifyWatch(obj, method, val) {
  const debug = (...args) => {
    // const KEY = `${obj.constructor.name}.${method}--${Math.random()}--`
    // if (method === 'draft') {
    //   console.log(KEY, ...args)
    // }
  }

  let current = Mobx.observable.box(DEFAULT_VALUE)
  let currentDisposable = null
  let currentObservable = null
  let autoObserver = null
  const stopAutoObserve = () => autoObserver && autoObserver()

  const update = newValue => {
    let value = newValue
    if (Mobx.isObservableArray(value) || Mobx.isObservableMap(value)) {
      value = Mobx.toJS(value)
    }
    debug('update ===', value)
    current.set(Mobx.observable.box(value))
  }

  function runObservable() {
    stopAutoObserve()
    autoObserver = Mobx.autorun(() => {
      if (currentObservable) {
        const value = currentObservable.get
          ? currentObservable.get()
          : currentObservable
        update(value) // set + wrap
      }
    })
  }

  let stop

  function watcher(val) {
    return () => {
      const result = resolve(val.call(obj, obj.props)) // hit user observables // pass in props
      const observableLike = isObservableLike(result)
      stopAutoObserve()

      const replaceDisposable = () => {
        if (currentDisposable) {
          currentDisposable()
          currentDisposable = null
        }
        if (result && result.dispose) {
          currentDisposable = result.dispose.bind(result)
        }
      }

      if (observableLike) {
        if (result.isntConnected) {
          return
        }
        const isSameObservable =
          currentObservable && currentObservable[AID] === result[AID]
        if (isSameObservable) {
          console.log('get', currentObservable)
          update(currentObservable.get())
          return
        }
        replaceDisposable()
        currentObservable = result
        currentObservable[AID] = currentObservable[AID] || uid()
        runObservable()
      } else {
        replaceDisposable()
        if (isPromise(result)) {
          current.set(fromPromise(result))
        } else {
          debug('watchForNewValue ===', result)
          update(result)
        }
      }
    }
  }

  // autorun vs reaction
  if (Array.isArray(val)) {
    // reaction
    stop = Mobx.reaction(val[0], watcher(val[1]), true)
  } else {
    //autorun
    stop = Mobx.autorun(watcher(val))
  }

  Object.defineProperty(obj, method, {
    get() {
      const result = current.get()
      debug('getttttttt', result)
      if (result && result.promise) {
        return result.value
      }
      if (isObservable(result)) {
        let value = result.get()
        if (
          value &&
          (Mobx.isObservableArray(value) || Mobx.isObservableMap(value))
        ) {
          value = Mobx.toJS(value)
        }
        return value
      }
      return result
    },
  })

  Object.defineProperty(obj, `${method}__automagic_source`, {
    get() {
      return { current, currentObservable }
    },
  })

  obj.subscriptions.add(() => {
    if (currentDisposable) {
      currentDisposable()
    }
    stop()
    stopAutoObserve && stopAutoObserve()
  })

  return current
}
