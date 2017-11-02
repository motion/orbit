// @flow
import global from 'global'
import { fromPromise, isPromiseBasedObservable } from 'mobx-utils'
import fromStream from './fromStream'
import * as Mobx from 'mobx'
import { Observable } from 'rxjs'

if (module && module.hot) {
  module.hot.accept(_ => _) // prevent aggressive hmrs
}

const isObservable = x => {
  if (!x) {
    return false
  }
  if (x.isObservable) {
    return true
  }
  try {
    return Mobx.isObservable(x)
  } catch (e) {
    console.error('err', e)
    return false
  }
}
const isFunction = val => typeof val === 'function'
const isQuery = val => val && !!val.$isQuery
const isRxObservable = val =>
  val instanceof Observable || (val && val.subscribe && val.source)
const isPromise = val => val instanceof Promise
const isWatch = (val: any) => val && val.IS_AUTO_RUN
const isObservableLike = val =>
  (val && (val.isntConnected || val.isObservable || isObservable(val))) || false

const DEFAULT_VALUE = undefined

export default function automagical() {
  return {
    name: 'automagical',
    onlyClass: true,
    decorator: (Klass: Class<any> | Function) => {
      Klass.prototype.automagic =
        Klass.prototype.automagic ||
        function() {
          if (!this._isAutomagical) {
            automagic(this)
            this._isAutomagical = true
          }
        }
      return Klass
    },
  }
}

const FILTER_KEYS = {
  automagic: true,
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
  subscriptions: true,
  watch: true,
  $mobx: true,
  emitter: true,
  emit: true,
  on: true,
  CompositeDisposable: true,
  glossElement: true,
}

function collectGetterPropertyDescriptors(proto) {
  const fproto = Object.getOwnPropertyNames(proto).filter(
    x => !FILTER_KEYS[x] && x[0] !== '_'
  )

  return fproto.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: Object.getOwnPropertyDescriptor(proto, cur),
    }),
    {}
  )
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

function mobxifyRxQuery(obj, method) {
  const value = obj[method]
  const observable = Mobx.observable.box(undefined)
  const runObservable = () => {
    const stream = value.$.subscribe(res => {
      observable.set(res)
    })
    obj.subscriptions.add(() => stream.unsubscribe())
  }
  if (value.isntConnected) {
    value.onConnection().then(runObservable)
  } else {
    runObservable()
  }
  Object.defineProperty(obj, method, {
    get() {
      return observable.get()
    },
  })
}

// TODO use rxdb api
function isRxDbQuery(query: any): boolean {
  return query && (query.isntConnected || !!query.mquery)
}

function mobxifyRxObservable(obj, method, val) {
  const stream = fromStream(val || obj[method])
  Mobx.extendShallowObservable(obj, { [method]: stream })
  obj.subscriptions.add(stream)
}

type MagicalObject = {
  subscriptions: { add: (fn: Function) => void },
}

function automagic(obj: MagicalObject) {
  const descriptors = {
    ...Object.getOwnPropertyDescriptors(obj),
    ...collectGetterPropertyDescriptors(Object.getPrototypeOf(obj)),
  }

  // mutate to be mobx observables
  for (const method of Object.keys(descriptors)) {
    mobxify(obj, method, descriptors[method])
  }
}

// * => mobx
function mobxify(target: Object, method: string, descriptor: Object) {
  // @computed get (do first to avoid hitting the getter on next line)
  if (descriptor && !!descriptor.get) {
    Mobx.extendObservable(target, {
      [method]: Mobx.computed(descriptor.get),
    })
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
    mobxifyRxQuery(target, method)
    return
  }
  if (isFunction(value)) {
    // @action
    const targetMethod = target[method].bind(target)
    const NAME = `${target.constructor.name}.${method}`
    // TODO remove in prod
    const logWrappedMethod = (...args) => {
      if (global.log && global.log.debug) {
        if (global.log.filter && global.log.filter.test(NAME)) {
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
function valueToObservable(inValue: any) {
  let value = inValue
  // convert RxQuery to RxObservable
  if (value) {
    if (isRxDbQuery(value)) {
      if (value.isntConnected) {
        return value
      } else {
        value = value.$
      }
    }
    // let this fall through from rxdbquerys
    if (isRxObservable(value)) {
      const mobxStream = fromStream(value)
      return {
        get: () => mobxStream.current,
        mobxStream,
        value: inValue,
        dispose: mobxStream.dispose,
        isObservable: true,
      }
    }
  }
  return value
}

const AID = '__AUTOMAGICAL_ID__'
const uid = () => `__ID_${Math.random()}__`

// watches values in an autorun, and resolves their results
function mobxifyWatch(obj: MagicalObject, method, val) {
  let current = Mobx.observable.box(DEFAULT_VALUE)
  let currentDisposable = null
  let currentObservable = null
  let autoObserveDispose = null
  let stopReaction
  let disposed = false
  let result
  const stopAutoObserve = () => autoObserveDispose && autoObserveDispose()

  let isntConnected = false

  function update(newValue) {
    if (isntConnected) {
      return
    }
    let value = newValue
    if (Mobx.isObservableArray(value) || Mobx.isObservableMap(value)) {
      value = Mobx.toJS(value)
    }
    current.set(Mobx.observable.box(value))
  }

  function runObservable() {
    stopAutoObserve()
    autoObserveDispose = Mobx.autorun(() => {
      if (currentObservable) {
        // 🐛 this fixes non-reaction for some odd reason
        // i think mobx things RxDocument looks "the same", so we follow version as well
        if (currentObservable.mobxStream) {
          currentObservable.mobxStream.currentVersion
        }
        update(
          currentObservable.get ? currentObservable.get() : currentObservable
        )
      }
    })
  }

  function dispose() {
    if (disposed) {
      return
    }
    if (currentDisposable) {
      currentDisposable()
    }
    if (stopReaction) {
      stopReaction()
    }
    if (stopAutoObserve) {
      stopAutoObserve()
    }
    disposed = true
  }

  // auto add subscription so it disposes on unmount
  if (obj.subscriptions && obj.subscriptions.add) {
    obj.subscriptions.add(dispose)
  }

  function run() {
    if (disposed) {
      console.log('avoiding work')
      return
    }
    if (Array.isArray(val)) {
      // reaction
      stopReaction = Mobx.reaction(val[0], watcher(val[1]), val[3] || true)
    } else {
      //autorun
      stopReaction = Mobx.autorun(watcher(val))
    }
  }

  function watcher(val) {
    let value = val

    return function watcherCb() {
      result = valueToObservable(value.call(obj, obj.props)) // hit user observables // pass in props
      const observableLike = isObservableLike(result)
      stopAutoObserve()

      function replaceDisposable() {
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
          // re-run after connect
          console.warn(obj.constructor.name, method, 'not connected')
          isntConnected = true
          result.onConnection().then(() => {
            isntConnected = false
            dispose()
            run()
          })
          return false
        }
        const isSameObservable =
          currentObservable && currentObservable[AID] === result[AID]
        if (isSameObservable && currentObservable) {
          update(currentObservable.get())
          return
        }
        replaceDisposable()
        currentObservable = result
        if (currentObservable && currentObservable instanceof Object) {
          currentObservable[AID] = currentObservable[AID] || uid()
        }
        runObservable()
      } else {
        replaceDisposable()
        if (isPromise(result)) {
          current.set(fromPromise(result))
        } else {
          update(result)
        }
      }
    }
  }

  // autorun vs reaction
  // settimeout allows the watchers to run after react renders
  setTimeout(run)

  Object.defineProperty(obj, method, {
    get() {
      const result = current.get()
      if (result && isPromiseBasedObservable(result)) {
        return result.value
      }
      if (isObservable(result)) {
        let value = result.get()
        return value
      }
      return result
    },
  })

  Object.defineProperty(obj, `${method}__automagic_source`, {
    get() {
      return { result, current, currentObservable }
    },
  })

  return current
}
