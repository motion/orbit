import { fromPromise, isPromiseBasedObservable } from 'mobx-utils'
import * as Mobx from 'mobx'
import * as McroHelpers from '@mcro/helpers'
import debug from '@mcro/debug'
import {
  Reaction,
  ReactionRejectionError,
  ReactionTimeoutError,
} from './constants'

// export @react decorator
export { react } from './react'
export * from './constants'

const root = typeof window !== 'undefined' ? window : require('global')
const IS_PROD = process.env.NODE_ENV === 'production'

type MagicalObject = {
  subscriptions: { add: ({ dispose: Function }) => void }
  __automagical: {
    watchers?: [any] | undefined[]
    deep?: {}
    started?: boolean
  }
  props?: {}
}

let id = 1
const uid = () => id++ % Number.MAX_VALUE

root.__trackStateChanges = {}

const log = debug('react')
const logState = debug('react+')
const logInfo = debug('automagical')

const PREFIX = `=>`
const logRes = (res: any) => {
  if (typeof res === 'undefined') {
    return []
  }
  if (res instanceof Promise) {
    return [PREFIX, 'Promise']
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
          }
          if (!this.__automagical.started) {
            decorateClassWithAutomagic(this)
            if (this.__automagical.watchers) {
              for (const watcher of this.__automagical.watchers) {
                watcher()
              }
            }
            this.__automagical.started = true
          }
        }
      return Klass
    },
  }
}

const FILTER_KEYS = {
  __automagical: true,
  automagic: true,
  constructor: true,
  dispose: true,
  props: true,
  ref: true,
  render: true,
  requestAnimationFrame: true,
  setInterval: true,
  setTimeout: true,
  subscriptions: true,
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

function getAutoRunDescriptors(obj) {
  const protoDescriptors = collectGetterPropertyDescriptors(
    Object.getPrototypeOf(obj),
  )
  return Object.keys(protoDescriptors)
    .filter(
      key => protoDescriptors[key].get && protoDescriptors[key].get.IS_AUTO_RUN,
    )
    .reduce((a, b) => ({ ...a, [b]: protoDescriptors[b] }), {})
}

function decorateClassWithAutomagic(obj: MagicalObject) {
  const descriptors = {
    ...Object.keys(obj).reduce(
      (a, b) => ({ ...a, [b]: Object.getOwnPropertyDescriptor(obj, b) }),
      {},
    ),
    ...getAutoRunDescriptors(obj),
  }
  const decorations = {}
  for (const method of Object.keys(descriptors)) {
    if (FILTER_KEYS[method]) {
      continue
    }
    const decor = decorateMethodWithAutomagic(obj, method, descriptors[method])
    if (decor) {
      decorations[method] = decor
    }
  }
  Mobx.decorate(obj, decorations)
}

// * => mobx
function decorateMethodWithAutomagic(
  target: MagicalObject,
  method: string,
  descriptor: PropertyDescriptor,
) {
  // non decorator reactions
  if (descriptor && descriptor.value) {
    if (descriptor.value instanceof Reaction) {
      const reaction = descriptor.value
      mobxifyWatch(target, method, reaction.reaction, reaction.options)
      return
    }
    if (descriptor.value.__IS_DEEP) {
      delete descriptor.value.__IS_DEEP
      return Mobx.observable.deep
    }
  }
  if (descriptor && (!!descriptor.get || !!descriptor.set)) {
    return Mobx.computed
  }
  if (target.__automagical.deep && target.__automagical.deep[method]) {
    return Mobx.observable.deep
  }
  let value = target[method]
  // @watch: autorun |> automagical (value)
  if (isWatch(value)) {
    mobxifyWatch(
      target,
      method,
      value,
      typeof value.IS_AUTO_RUN === 'object' ? value.IS_AUTO_RUN : undefined,
    )
    return
  }
  if (isFunction(value)) {
    const NAME = `${target.constructor.name}.${method}`
    // autobind
    const targetMethod = target[method].bind(target)
    // wrap for logging helpers
    target[method] = (...args) => {
      if (root.__shouldLog && root.__shouldLog[NAME]) {
        log(NAME, ...args)
      }
      return targetMethod(...args)
    }
    // actionize
    return Mobx.action
  }
  if (Mobx.isObservable(target[method])) {
    return
  }
  return Mobx.observable.ref
}

// * => Mobx
function specialValueToObservable(inValue: any) {
  let value = inValue
  if (value) {
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
    isIf,
    delayValue,
    defaultValue,
    onlyUpdateIfChanged,
    ...options
  } = McroHelpers.getReactionOptions({
    name: method,
    ...userOptions,
  })
  const delayLog =
    options && options.delay >= 0 ? ` (...${options.delay}ms)` : ''
  const name = `${getReactionName(obj)} | ${method} | ${delayLog}`
  let preventLog = options.log === false
  let current = Mobx.observable.box(defaultValue || DEFAULT_VALUE, { name })
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
    if (result && result.isMobXObservableValue) {
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
        update(
          typeof curObservable.get === 'function'
            ? curObservable.get()
            : curObservable,
        )
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
    obj.subscriptions.add({ dispose })
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

  const preventLogging = () => {
    preventLog = true
  }

  const sleep = ms => {
    // log(`${name} sleeping for ${ms}`)
    return new Promise((resolve, reject) => {
      if (!reactionID) {
        return reject(new ReactionRejectionError())
      }
      if (typeof ms === 'undefined') {
        resolve()
        return
      }
      const sleepTimeout = setTimeout(resolve, ms)
      rejections.push(() => {
        clearTimeout(sleepTimeout)
        reject(new ReactionRejectionError())
      })
    })
  }

  const when = (condition, timeout) => {
    // log(`${name} sleeping for ${ms}`)
    const whenPromise = new Promise((resolve, reject) => {
      let cancelTm
      if (!reactionID) {
        return reject(new ReactionRejectionError())
      }
      let cancelWhen = false
      Mobx.when(condition)
        .then((val: any) => {
          if (cancelWhen) return
          clearTimeout(cancelTm)
          resolve(val)
        })
        .catch(() => {
          clearTimeout(cancelTm)
          reject()
        })

      if (timeout) {
        cancelTm = setTimeout(() => {
          console.log('automagical, when timed out!')
          reject(new ReactionTimeoutError())
        }, timeout)
      }
      const cancel = () => {
        clearTimeout(cancelTm)
        cancelWhen = true
        reject(new ReactionRejectionError())
      }
      rejections.push(cancel)
    })
    return whenPromise
  }

  const whenChanged = (condition, dontCompare) => {
    let oldVal
    let curVal
    return new Promise((resolve, reject) => {
      if (!reactionID) {
        return reject(new ReactionRejectionError())
      }
      let cancelWhen = false
      Mobx.when(() => {
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
        reject(new ReactionRejectionError())
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
        console.log('reactinf', reactValArg)
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

      let reactionResult

      // to allow cancels!
      try {
        reactionResult = reactionFn.call(
          obj,
          isReaction ? reactValArg : obj.props,
          {
            preventLogging,
            // allows setting multiple values in a reaction
            setValue: val => {
              hasCalledSetValue = true
              updateAsyncValue(val)
            },
            getValue: getCurrentValue,
            sleep,
            when,
            whenChanged,
          },
        )
      } catch (err) {
        // got a nice cancel!
        if (
          err instanceof ReactionRejectionError ||
          err instanceof ReactionTimeoutError
        ) {
          if (!IS_PROD && options.log === 'all') {
            log(`${name} [${curID}] cancelled`)
          }
          return
        }
        console.error(err)
        return
      }

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
            if (
              err instanceof ReactionRejectionError ||
              err instanceof ReactionTimeoutError
            ) {
              if (!IS_PROD && options.log === 'all') {
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
          if (options.log !== 'state') {
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
          update(
            typeof curObservable.get === 'function'
              ? curObservable.get()
              : curObservable,
          )
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
    enumerable: false,
    get() {
      return { result, current, curObservable }
    },
  })

  return current
}
