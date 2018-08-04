import { fromPromise, isPromiseBasedObservable } from 'mobx-utils'
import * as Mobx from 'mobx'
import debug from '@mcro/debug'
import { ReactionOptions, ReactionHelpers } from './types'
import {
  Reaction,
  ReactionRejectionError,
  ReactionTimeoutError,
} from './constants'

// export @react decorator
export { react } from './react'
export {
  Reaction,
  ReactionRejectionError,
  ReactionTimeoutError,
} from './constants'
export * from './types'

// perf
const SHARED_REJECTION_ERROR = new ReactionRejectionError()

// TODO: fix deep() wrapper doesnt trigger reactions when mutating objects
// so basically this.reactiveObj.x = 1, wont trigger react(() => this.reactiveObj)

const root = typeof window !== 'undefined' ? window : require('global')
const IS_PROD = process.env.NODE_ENV === 'production'
const voidFn = () => void 0

export function getReactionOptions(userOptions?: ReactionOptions) {
  let options: ReactionOptions = {
    equals: Mobx.comparer.structural,
  }
  if (userOptions.immediate) {
    options.fireImmediately = true
    delete userOptions.immediate
  }
  if (userOptions === true) {
    options.fireImmediately = true
  }
  if (userOptions instanceof Object) {
    options = { ...options, ...userOptions }
  }
  return options
}

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
  (val && (val.isObservable || isObservable(val))) || false

const DEFAULT_VALUE = undefined

export function automagicClass() {
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

export default function automagical() {
  return {
    name: 'automagical',
    decorator: (Klass: Function) => {
      if (!Klass.prototype.automagic) {
        Klass.prototype.automagic = automagicClass
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
  setInterval: true,
  setTimeout: true,
  subscriptions: true,
  emitter: true,
  emit: true,
  on: true,
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
    delayValue,
    defaultValue,
    onlyUpdateIfChanged,
    trace,
    ...options
  } = getReactionOptions({
    name: method,
    ...userOptions,
  })
  const delayLog =
    options && options.delay >= 0 ? ` (...${options.delay}ms)` : ''
  const methodName = `${getReactionName(obj)}.${method}`
    .padEnd(35, ' ')
    .slice(0, 35)
  const name = `--> ${methodName} | ${delayLog}`
  let preventLog = options.log === false
  let current = Mobx.observable.box(defaultValue || DEFAULT_VALUE, { name })
  let prev
  let curDisposable = null
  let curObservable = null
  let autoObserveDispose = null
  let stopReaction
  let disposed = false
  let result
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
    return result
  }

  function update(newValue) {
    if (typeof val === 'undefined') {
      // HELP this may be bad idea, but in practice we never ever set something undefined
      // testing this out essentially
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
      return
    }
    if (Mobx.isObservable(value)) {
      value = Mobx.toJS(value)
    }
    current.set(value)
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
          throw new Error(
            `Reaction requires second function. ${name} got ${typeof val}`,
          )
        }
        // reaction
        // @ts-ignore
        stopReaction = Mobx.reaction(val[0], watcher(val[1]), options)
      } else {
        if (typeof val !== 'function') {
          throw new Error(
            `Reaction requires function. ${name} got ${typeof val}`,
          )
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
    rejections = []
    isAsyncReaction = false
    reactionID = null
  }

  const preventLogging = () => {
    preventLog = true
  }

  const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!reactionID) {
        reject(SHARED_REJECTION_ERROR)
        return
      }
      if (typeof ms === 'undefined') {
        resolve()
        return
      }
      const sleepTimeout = setTimeout(() => resolve(), ms)
      rejections.push(() => {
        clearTimeout(sleepTimeout)
        reject(SHARED_REJECTION_ERROR)
      })
    })
  }

  const when = (condition: () => boolean, timeout?: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      let cancelTm
      if (!reactionID) {
        return reject(SHARED_REJECTION_ERROR)
      }
      let cancelWhen = false
      Mobx.when(condition)
        .then(() => {
          if (cancelWhen) return
          clearTimeout(cancelTm)
          resolve()
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
        reject(SHARED_REJECTION_ERROR)
      }
      rejections.push(cancel)
    })
  }

  const whenChanged = <A>(condition: () => A, dontCompare?): Promise<A> => {
    let oldVal = condition()
    let curVal
    return new Promise((resolve, reject) => {
      if (!reactionID) {
        return reject(SHARED_REJECTION_ERROR)
      }
      let cancelWhen = false
      Mobx.when(() => {
        curVal = condition()
        if (dontCompare) {
          return true
        }
        return !Mobx.comparer.structural(curVal, oldVal)
      })
        .then(() => {
          if (cancelWhen) {
            return
          }
          resolve(curVal)
        })
        .catch(reject)
      rejections.push(() => {
        cancelWhen = true
        reject(SHARED_REJECTION_ERROR)
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

  const reactionHelpers: ReactionHelpers = {
    preventLogging,
    getValue: getCurrentValue,
    setValue: voidFn,
    sleep,
    when,
    whenChanged,
  }

  function watcher(reactionFn) {
    return function watcherCb(reactValArg) {
      if (trace) {
        Mobx.trace()
      }
      reset()
      reactionID = uid()
      const curID = reactionID
      const updateAsyncValue = val => {
        const isValid = curID === reactionID
        if (isValid) {
          replaceDisposable()
          update(val)
        }
        if (!IS_PROD && !preventLog) {
          log(
            `${name} (${Date.now() - start}ms) ${
              isAsyncReaction ? `[${id}]` : ''
            } = `,
            val,
            isValid ? '✅' : `🚫 ${reactionID}/${curID}`,
          )
        }
      }
      let hasCalledSetValue = false
      const start = Date.now()
      root.__trackStateChanges.isActive = true

      let reactionResult
      reactionHelpers.setValue = val => {
        hasCalledSetValue = true
        updateAsyncValue(val)
      }

      // to allow cancels
      try {
        reactionResult = reactionFn.call(
          obj,
          // single function reactions get helpers directly
          // value reactions get the value and helpers second
          isReaction ? reactValArg : reactionHelpers,
          reactionHelpers,
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
      const prefix = `${name} ${isReaction ? `@r` : `@w`}`
      root.__trackStateChanges = {}

      // handle promises
      if (reactionResult instanceof Promise) {
        isAsyncReaction = true
        reactionResult
          .then(val => {
            if (!reactionID) {
              if (!IS_PROD && !preventLog) {
                log(`${prefix} 🚫`)
              }
              // cancelled before finishing
              return
            }
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
              console.log(`throwing err from ${prefix}`, err)
              throw new Error(err)
            }
          })
        return
      }

      // store result as observable
      result = specialValueToObservable(reactionResult)
      if (!IS_PROD && !preventLog && !delayValue) {
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

  return current
}
