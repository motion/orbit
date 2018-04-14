import { fromPromise, isPromiseBasedObservable, whenAsync } from 'mobx-utils'
import { fromStream } from './fromStream'
import * as Mobx from 'mobx'
import { Observable } from 'rxjs'
import * as Helpers from '@mcro/helpers'
import debug from '@mcro/debug'

const root = typeof window !== 'undefined' ? window : require('global')
const IS_PROD = process.env.NODE_ENV === 'production'

type MagicalObject = {
  subscriptions: { add: (fn: Function) => void }
  __automagical: { watchers?: [any] | undefined[] }
  props?: {}
}

let id = 1
const uid = () => id++ % Number.MAX_VALUE

root.__trackStateChanges = {}

const log = debug('-> ')
const logState = debug('+> ')
const logInfo = debug('automagical')
debug.quiet('automagical')

const RejectReactionSymbol = Symbol('REJECT_REACTION')

const PREFIX = `=>`
const logRes = (res: any) => {
  if (typeof res === 'undefined') {
    return []
  }
  if (res instanceof Promise) {
    return [PREFIX, 'Promise']
  }
  if (res && res.value && isQuery(res.value)) {
    return [PREFIX, 'RxQuery']
  }
  if (Mobx.isArrayLike(res)) {
    return [PREFIX, res.map(x => Mobx.toJS(x))]
  }
  return [PREFIX, Mobx.toJS(res)]
}
const getReactionName = (obj: MagicalObject) => {
  return obj.constructor.name
    .replace('Store', '')
    .padEnd(12, ' ')
    .slice(0, 12)
}

const isObservable = (x: any) => {
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
const isQuery = val => val && (val.$isQuery || (!!val.mquery && val.id))
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
    decorator: (Klass: Function) => {
      Klass.prototype.automagic =
        Klass.prototype.automagic ||
        function() {
          if (!this.__automagical) {
            this.__automagical = {}
            decorateClassWithAutomagic(this)
            if (this.__automagical.watchers) {
              for (const watcher of this.__automagical.watchers) {
                watcher()
              }
            }
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
  requestAnimationFrame: true,
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
    x => !FILTER_KEYS[x] && x[0] !== '_',
  )
  return fproto.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: Object.getOwnPropertyDescriptor(proto, cur),
    }),
    {},
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
      if (observable.state === 'rejected' || observable.state === 'fulfilled') {
        return observable.value
      }
    },
  })
}

function mobxifyRxObservable(obj, method) {
  const value = obj[method]
  const observable = Mobx.observable.box(undefined)
  const stream = value.subscribe(res => {
    observable.set(res)
  })
  obj.subscriptions.add(() => stream.unsubscribe())
  Object.defineProperty(obj, method, {
    get() {
      return observable.get()
    },
  })
}

function mobxifyRxQuery(obj, method) {
  const value = obj[method]
  const observable = Mobx.observable.box(undefined)
  const runObservable = () => {
    const stream = value.subscribe(res => {
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

function decorateClassWithAutomagic(obj: MagicalObject) {
  const descriptors = {
    ...Object.keys(obj).reduce(
      (a, b) => ({ ...a, [b]: Object.getOwnPropertyDescriptor(obj, b) }),
      {},
    ),
    ...collectGetterPropertyDescriptors(Object.getPrototypeOf(obj)),
  }
  // mutate to be mobx observables
  for (const method of Object.keys(descriptors)) {
    if (method === '__automagical') continue
    decorateMethodWithAutomagic(obj, method, descriptors[method])
  }
}

// * => mobx
function decorateMethodWithAutomagic(
  target: MagicalObject,
  method: string,
  descriptor: PropertyDescriptor,
) {
  // @computed get (do first to avoid hitting the getter on next line)
  // @ts-ignore
  if (descriptor && descriptor.get && descriptor.get.IS_AUTO_RUN) {
    return mobxifyWatch(
      target,
      method,
      // @ts-ignore
      descriptor.get.value,
      // @ts-ignore
      descriptor.get.options,
    )
  }
  if (descriptor && (!!descriptor.get || !!descriptor.set)) {
    if (descriptor.get) {
      Mobx.extendObservable(target, {
        [method]: Mobx.computed(descriptor.get),
      })
    }
    if (descriptor.set) {
      Object.defineProperty(target, method, descriptor)
    }
    return
  }

  let value = target[method]

  // let it be
  if (isObservable(value)) {
    return value
  }
  // @watch: autorun |> automagical (value)
  if (isWatch(value)) {
    return mobxifyWatch(
      target,
      method,
      value,
      typeof value.IS_AUTO_RUN === 'object' ? value.IS_AUTO_RUN : undefined,
    )
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
      if (root.__shouldLog && root.__shouldLog[NAME]) {
        log(NAME, ...args)
      }
      return targetMethod(...args)
    }

    target[method] = Mobx.action(NAME, logWrappedMethod)
    return target[method]
  }
  // @observable.ref
  Mobx.extendObservable(target, { [method]: value })
  return value
}

// * => Mobx
function specialValueToObservable(inValue: any) {
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
    if (isPromise(value)) {
      const promiseStream = fromPromise(value)
      return {
        get: () => {
          if (
            promiseStream.state === 'rejected' ||
            promiseStream.state === 'fulfilled'
          ) {
            return promiseStream.value
          }
        },
        promiseStream,
        isObservable: true,
      }
    }
  }
  return value
}

const AID = '__AUTOMAGICAL_ID__'
const observableId = () => `__ID_${Math.random()}__`

// watches values in an autorun, and resolves their results
function mobxifyWatch(obj: MagicalObject, method, val, userOptions) {
  const {
    log: shouldLog,
    isIf,
    delayValue,
    logReaction,
    defaultValue,
    onlyUpdateIfChanged,
    ...options
  } = Helpers.getReactionOptions({
    name: method,
    ...userOptions,
  })
  const delayLog =
    options && options.delay >= 0 ? ` (...${options.delay}ms)` : ''
  const name = `${getReactionName(obj)} | ${method} | ${delayLog}`
  let preventLog = shouldLog === false
  let current = Mobx.observable.box(defaultValue || DEFAULT_VALUE)
  let prev
  let curDisposable = null
  let curObservable = null
  let autoObserveDispose = null
  let stopReaction
  let disposed = false
  let result
  let isntConnected = false
  const stopAutoObserve = () => autoObserveDispose && autoObserveDispose()

  function getCurrentValue() {
    const result = current.get()
    if (result && isPromiseBasedObservable(result)) {
      if (result.state === 'fulfilled' || result.state === 'rejected') {
        // @ts-ignore
        return result.value
      } else {
        return undefined
      }
    }
    if (result && result instanceof Mobx.BaseAtom) {
      // @ts-ignore
      return result.get()
    }
    return result
  }

  function update(newValue) {
    if (typeof val === 'undefined') {
      // HELP this may be bad idea, but in practice we never ever set something undefined
      // testing this out essentially
      return
    }
    if (isntConnected) {
      return
    }
    let value = newValue
    if (delayValue) {
      value = prev
      prev = newValue
      if (!preventLog) {
        log(`${name} (delayValue) =`, value)
      }
    }
    if (
      onlyUpdateIfChanged &&
      Mobx.comparer.structural(getCurrentValue(), newValue)
    ) {
      logInfo(`${name} didnt change, avoid update`)
      return
    }
    if (Mobx.isObservable(value)) {
      value = Mobx.toJS(value)
    }
    current.set(Mobx.observable.box(value))
  }

  function runObservable() {
    stopAutoObserve()
    autoObserveDispose = Mobx.autorun(() => {
      if (curObservable) {
        // 🐛 this fixes non-reaction for some odd reason
        // i think mobx things RxDocument looks "the same", so we follow version as well
        if (curObservable.mobxStream) {
          curObservable.mobxStream.currentVersion
        }
        update(curObservable.get ? curObservable.get() : curObservable)
      }
    })
  }

  function dispose() {
    if (disposed) {
      return
    }
    if (curDisposable) {
      curDisposable()
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

  const isReaction = Array.isArray(val)

  function run() {
    setTimeout(() => {
      if (disposed) {
        // this avoids work/bugs by cancelling reactions after disposed
        return
      }
      if (isReaction) {
        if (typeof val[1] !== 'function') {
          console.log(val)
          throw new Error(`Didn't supply a function to reaction ${name}`)
        }
        // reaction
        // @ts-ignore
        stopReaction = Mobx.reaction(val[0], watcher(val[1]), options)
      } else {
        if (typeof val !== 'function') {
          throw new Error(`Didn't supply a function to watcher ${name}`)
        }
        //autorun
        stopReaction = Mobx.autorun(watcher(val), options)
      }
    }, 0)
  }

  // state used outside each watch/reaction
  let isAsyncReaction = false
  let reactionID = null
  let rejections = []

  const reset = () => {
    rejections.map(rej => rej())
    isAsyncReaction = false
    reactionID = null
  }

  const preventLogging = () => (preventLog = true)
  const sleep = ms => {
    // log(`${name} sleeping for ${ms}`)
    return new Promise((resolve, reject) => {
      if (!reactionID) {
        return reject(RejectReactionSymbol)
      }
      const sleepTimeout = setTimeout(resolve, ms)
      rejections.push(() => {
        clearTimeout(sleepTimeout)
        reject(RejectReactionSymbol)
      })
    })
  }
  const when = condition => {
    // log(`${name} sleeping for ${ms}`)
    return new Promise((resolve, reject) => {
      if (!reactionID) {
        return reject(RejectReactionSymbol)
      }
      let cancelWhen = false
      whenAsync(condition)
        .then((val: any) => {
          if (cancelWhen) return
          resolve(val)
        })
        .catch(reject)
      rejections.push(() => {
        cancelWhen = true
        reject(RejectReactionSymbol)
      })
    })
  }
  const whenChanged = (condition, dontCompare) => {
    let oldVal
    let curVal
    return new Promise((resolve, reject) => {
      if (!reactionID) {
        return reject(RejectReactionSymbol)
      }
      let cancelWhen = false
      whenAsync(() => {
        if (typeof oldVal === 'undefined') {
          oldVal = condition()
          return false
        }
        curVal = condition()
        if (dontCompare) {
          return true
        }
        return !Mobx.comparer.structural(curVal, oldVal)
      })
        .then(() => {
          if (cancelWhen) return
          resolve(curVal)
        })
        .catch(reject)
      rejections.push(() => {
        cancelWhen = true
        reject(RejectReactionSymbol)
      })
    })
  }

  function replaceDisposable() {
    if (curDisposable) {
      curDisposable()
      curDisposable = null
    }
    if (result && result.dispose) {
      curDisposable = result.dispose.bind(result)
    }
  }

  function watcher(reactionFn) {
    return function watcherCb(reactValArg) {
      reset()
      // @react.if check. avoids 0 bugs
      if (isIf && !reactValArg && reactValArg !== 0) {
        return
      }
      if (isIf) {
        console.log('reactin', reactValArg)
      }
      reactionID = uid()
      const curID = reactionID
      const updateAsyncValue = val => {
        if (curID === reactionID) {
          replaceDisposable()
          if (!IS_PROD && !preventLog) {
            log(
              `${name} (${Date.now() - start}ms) ${
                isAsyncReaction ? `[${id}]` : ''
              } = `,
              val,
            )
          }
          update(val)
        }
      }
      let hasCalledSetValue = false
      const start = Date.now()
      root.__trackStateChanges.isActive = true
      const reactionResult = reactionFn.call(
        obj,
        isReaction ? reactValArg : obj.props,
        {
          preventLogging,
          // allows setting multiple values in a reaction
          setValue: val => {
            hasCalledSetValue = true
            updateAsyncValue(val)
          },
          sleep,
          when,
          whenChanged,
        },
      )
      const changed = root.__trackStateChanges.changed
      root.__trackStateChanges = {}
      // handle promises
      if (reactionResult instanceof Promise) {
        isAsyncReaction = true
        reactionResult
          .then(val => {
            if (typeof val !== 'undefined') {
              if (hasCalledSetValue) {
                throw new Error(
                  `In ${name}, invalid operation: called setValue, then returned a value. Use one or the other for sanity`,
                )
              }
              updateAsyncValue(val)
            }
          })
          .catch(err => {
            if (err === RejectReactionSymbol) {
              if (!IS_PROD && !preventLog) {
                log(`${name} [${curID}] cancelled`)
              }
            } else {
              console.log('throwing err', err)
              throw err
            }
          })
        return
      }
      // store result as observable
      result = specialValueToObservable(reactionResult)
      if (!IS_PROD && !preventLog && !delayValue) {
        const prefix = `${name} ${isReaction ? `@r` : `@w`}`
        if (changed && Object.keys(changed).length) {
          logState(
            `${prefix}`,
            reactValArg,
            ...logRes(result),
            `\n\n CHANGED:`,
            changed,
            `\n\n`,
          )
        } else {
          if (logReaction !== false) {
            log(`${prefix}`, isReaction ? reactValArg : '', ...logRes(result))
          }
        }
      }
      const observableLike = isObservableLike(result)
      stopAutoObserve()

      if (observableLike) {
        if (result.isntConnected) {
          // re-run after connect
          console.warn(obj.constructor.name, method, 'not connected')
          isntConnected = true
          result.onConnection().then(() => {
            console.warn(obj.constructor.name, method, 'is now reconnected')
            isntConnected = false
            dispose()
            disposed = false
            run()
          })
          return false
        }
        const isSameObservable =
          curObservable && curObservable[AID] === result[AID]
        if (isSameObservable && curObservable) {
          update(curObservable.get())
          return
        }
        replaceDisposable()
        curObservable = result
        // track it for equality checks
        if (curObservable && curObservable instanceof Object) {
          curObservable[AID] = curObservable[AID] || observableId()
        }
        runObservable()
      } else {
        replaceDisposable()
        update(result)
      }
    }
  }

  // add to __watchFns
  if (obj.__automagical) {
    obj.__automagical.watchers = obj.__automagical.watchers || []
    // @ts-ignore
    obj.__automagical.watchers.push(run)
  }

  Object.defineProperty(obj, method, {
    get: getCurrentValue,
  })
  Object.defineProperty(obj, `${method}__automagic_source`, {
    get() {
      return { result, current, curObservable }
    },
  })

  return current
}
