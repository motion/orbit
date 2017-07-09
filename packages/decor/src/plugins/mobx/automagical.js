// @flow
import { fromStream, fromPromise } from 'mobx-utils'
import { Observable } from 'rxjs'
import {
  observable,
  action,
  extendShallowObservable,
  extendObservable,
  toJS,
  autorun,
} from 'mobx'

const isObservable = val => val && val.$mobx
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

function mobxifyRxObservable(obj, method) {
  extendShallowObservable(obj, { [method]: fromStream(obj[method]) })
  obj.subscriptions.add(observable)
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
    extendObservable(target, getter)
    return
  }

  let value = target[method]

  try {
    if (isObservable(value)) {
      // let it be
      return value
    }
  } catch (e) {
    console.error('weird error sometimes on hmr', value)
    throw e
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

    target[method] = action(NAME, logWrappedMethod)
    return target[method]
  }
  // @observable.ref
  extendShallowObservable(target, { [method]: value })
  return value
}

// * => Mobx
function resolve(value) {
  if (isRxObservable(value)) {
    return fromStream(value) // .current & .dispose
  }
  return value
}

// watches values in an autorun, and resolves their results
function mobxifyWatch(obj, method, val) {
  const KEY = `${obj.constructor.name}.${method}`
  log('mobxifyWatch', KEY)
  let current = observable.shallowBox(null)
  let currentDisposable = null
  let currentObservable = null
  let stopObservableAutorun

  function runObservable() {
    log('runObservable', KEY)
    stopObservableAutorun && stopObservableAutorun()
    stopObservableAutorun = autorun(() => {
      if (currentObservable) {
        log('automagical.currentObservable', KEY, currentObservable.current)
        current.set(currentObservable.current) // hit observable
      }
    })
  }

  let uid = 0
  let stopAutorun

  function run() {
    stopAutorun && stopAutorun()
    stopAutorun = autorun(watchForNewValue)
  }

  async function watchForNewValue() {
    const mid = ++uid // lock
    const result = resolve(val.call(obj, obj.props)) // hit user observables // pass in props
    log('watchForNewValue', KEY, result)
    stopObservableAutorun && stopObservableAutorun()
    if (currentDisposable) {
      currentDisposable()
      currentDisposable = null
    }
    if (result && result.dispose) {
      currentDisposable = result.dispose
    }
    if (result && (result.$isQuery || isObservable(result))) {
      log('watchforNewValue isQuery isntConnected?', result.isntConnected)
      if (result.isntConnected) {
        return
      }
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
  }

  // run
  run()

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
