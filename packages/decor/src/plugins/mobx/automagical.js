// @flow
import { fromStream, fromPromise } from 'mobx-utils'
import * as Mobx from 'mobx'

// turned off for now
const debug = () => {}

if (module && module.hot) {
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
const isRxObservable = val => window.Rx && val instanceof window.Rx.Observable
const isPromise = val => val instanceof Promise
const isWatch = (val: any) => val && val.IS_AUTO_RUN

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
    const stream = fromStream(value)
    return {
      get: () => stream.current,
      dispose: stream.dispose,
      isObservable: true,
    }
  }
  return value
}

const AID = '__AUTOMATICAL_ID__'
const uid = () => `__ID_${Math.random()}__`

// watches values in an autorun, and resolves their results
function mobxifyWatch(obj, method, val) {
  // const KEY = `${obj.constructor.name}.${method}--${Math.random()}--`
  let current = Mobx.observable.box(DEFAULT_VALUE)
  let currentDisposable = null
  let currentObservable = null
  let swappingOutSameObservable = false
  let stopAutoObserve

  const update = newValue => {
    let value = newValue
    if (Mobx.isObservableArray(value) || Mobx.isObservableMap(value)) {
      value = Mobx.toJS(value)
    }
    if (method === 'children') {
      debug('update ===', value)
    }
    current.set(Mobx.observable.box(value))
  }

  function runObservable() {
    stopAutoObserve && stopAutoObserve()
    stopAutoObserve = Mobx.autorun(() => {
      if (currentObservable) {
        const value = currentObservable.get()
        if (method === 'children') {
          debug(swappingOutSameObservable, 'runObservable.value = ', value)
        }
        update(value) // set + wrap
      }
    })
  }

  let stop

  function watcher(val) {
    return () => {
      const result = resolve(val.call(obj, obj.props)) // hit user observables // pass in props
      stopAutoObserve && stopAutoObserve()
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
        if (method === 'children') {
          debug('change up', currentObservable, result)
        }
        if (currentObservable && currentObservable[AID] === result[AID]) {
          debug('SAME OBSERVABLE, SWAP ONLY')
          swappingOutSameObservable = true
          update(currentObservable.get())
          return
        }
        currentObservable = result
        currentObservable[AID] = currentObservable[AID] || uid()
        runObservable()
      } else if (isPromise(result)) {
        current.set(fromPromise(result))
      } else {
        if (method === 'children') {
          debug('watchForNewValue ===', result)
        }
        update(result)
      }
    }
  }

  if (method === 'children') {
    debug('getting children', val)
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

  obj.subscriptions.add(() => {
    if (currentDisposable) {
      currentDisposable()
    }
    stop()
    stopAutoObserve && stopAutoObserve()
  })

  return current
}
