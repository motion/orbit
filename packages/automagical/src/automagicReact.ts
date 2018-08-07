import * as Mobx from 'mobx'
import { ReactionHelpers, MagicalObject } from './types'
import { ReactionRejectionError, ReactionTimeoutError } from './constants'
import {
  getReactionOptions,
  getReactionName,
  log,
  logState,
  logRes,
  Root,
} from './helpers'

const DEFAULT_VALUE = undefined
const SHARED_REJECTION_ERROR = new ReactionRejectionError()
const IS_PROD = process.env.NODE_ENV === 'production'
const voidFn = () => void 0

// hacky for now
Root.__trackStateChanges = {}

let id = 1
const uid = () => id++ % Number.MAX_VALUE

// watches values in an autorun, and resolves their results
export function automagicReact(obj: MagicalObject, method, val, userOptions) {
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
  let current = Mobx.observable.box(defaultValue || DEFAULT_VALUE, {
    name,
    deep: false,
  })
  let prev
  let stopReaction
  let disposed = false
  const state = {
    hasResolvedOnce: false,
  }

  function getCurrentValue() {
    return current.get()
  }

  function update(newValue) {
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
    state.hasResolvedOnce = true
    current.set(value)
  }

  function dispose() {
    if (disposed) {
      return
    }
    if (stopReaction) {
      stopReaction()
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

  const reactionHelpers: ReactionHelpers = {
    preventLogging,
    getValue: getCurrentValue,
    setValue: voidFn,
    sleep,
    when,
    whenChanged,
    state,
  }

  function watcher(reactionFn) {
    return function watcherCb(reactValArg) {
      reset()
      reactionID = uid()
      const curID = reactionID
      const updateAsyncValue = val => {
        const isValid = curID === reactionID
        if (isValid) {
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
      Root.__trackStateChanges.isActive = true

      let result
      reactionHelpers.setValue = val => {
        hasCalledSetValue = true
        updateAsyncValue(val)
      }

      // to allow cancels
      try {
        result = reactionFn.call(
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

      const changed = Root.__trackStateChanges.changed
      const prefix = `${name} ${isReaction ? `@r` : `@w`}`
      Root.__trackStateChanges = {}

      // handle promises
      if (result instanceof Promise) {
        isAsyncReaction = true
        result
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

      update(result)
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
