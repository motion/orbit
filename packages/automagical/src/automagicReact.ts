import * as Mobx from 'mobx'
import { ReactionHelpers, MagicalObject } from './types'
import { ReactionRejectionError, ReactionTimeoutError } from './constants'
import { getReactionOptions, getReactionName, log, logState, logRes, Root } from './helpers'
import { omitBy, isEqual } from 'lodash'

const DEFAULT_VALUE = undefined
const SHARED_REJECTION_ERROR = new ReactionRejectionError()
const IS_PROD = process.env.NODE_ENV !== 'development'
const voidFn = () => void 0

// hacky for now
Root.__trackStateChanges = {}

let id = 1
const uid = () => id++ % Number.MAX_VALUE

// simple diff output for dev mode
const diffLog = (a, b) => {
  if (a === b || Mobx.comparer.structural(a, b)) {
    return []
  }
  if (!b || typeof b !== 'object' || Array.isArray(b)) {
    return ['\n        new value:', b]
  }
  // object
  const diff = omitBy(a, (v, k) => b[k] === v)
  if (Object.keys(diff).length) {
    return ['\n        diff:', diff]
  }
  return []
}

const toJSDeep = obj => {
  const next = Mobx.toJS(obj)
  if (Array.isArray(next)) {
    return next.map(toJSDeep)
  }
  return next
}

const isEqualDeep = (a, b) => isEqual(toJSDeep(a), toJSDeep(b))

// watches values in an autorun, and resolves their results
export function automagicReact(obj: MagicalObject, method, val, userOptions) {
  const {
    delayValue,
    defaultValue,
    onlyUpdateIfChanged,
    onlyReactIfChanged,
    deferFirstRun,
    trace,
    ...options
  } = getReactionOptions({
    name: method,
    ...userOptions,
  })

  let mobxOptions = options as Mobx.IReactionOptions

  // we run immediately by default
  // its the 95% use case and causes less bugs
  mobxOptions.fireImmediately = !deferFirstRun

  const delayLog = options && options.delay >= 0 ? ` ..${options.delay}ms ` : ''
  const methodName = `${getReactionName(obj)}.${method}`
  const logName = `${methodName}${delayLog}`
  let preventLog = options.log === false
  let current = Mobx.observable.box(defaultValue || DEFAULT_VALUE, {
    name: logName,
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
        log.info(`delayValue ${logName}`, value)
      }
    }
    if (onlyUpdateIfChanged) {
      const oldVal = toJSDeep(getCurrentValue())
      const newVal = toJSDeep(newValue)
      if (isEqual(oldVal, newVal)) {
        return IS_PROD ? undefined : []
      } else {
        if (!IS_PROD) {
          log.verbose('onlyUpdateIfChanged changed:\n oldval:', oldVal, '\n newval:', newVal)
        }
      }
    }
    state.hasResolvedOnce = true
    // return diff in dev mode
    let res
    if (!IS_PROD) {
      res = diffLog(toJSDeep(getCurrentValue()), toJSDeep(value))
    }
    current.set(value)
    return res
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
          throw new Error(`Reaction requires second function. ${logName} got ${typeof val}`)
        }
        // reaction
        stopReaction = Mobx.reaction(val[0], watcher(val[1]), mobxOptions)
      } else {
        if (typeof val !== 'function') {
          throw new Error(`Reaction requires function. ${logName} got ${typeof val}`)
        }
        //autorun
        stopReaction = Mobx.autorun(watcher(val), mobxOptions)
      }
    }, 0)
  }

  // state used outside each watch/reaction
  let reactionID = null
  let rejections = []

  const reset = () => {
    rejections.map(rej => rej())
    rejections = []
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
    let lastReactVal
    return function watcherCb(reactValArg) {
      reset()
      if (onlyReactIfChanged) {
        const unchanged = isEqualDeep(lastReactVal, reactValArg)
        lastReactVal = reactValArg
        if (unchanged) {
          log.verbose(`onlyReactIfChanged, not changed: ${logName}`)
          return
        }
      }
      reactionID = uid()
      const curID = reactionID
      const updateAsyncValue = val => {
        const isValid = curID === reactionID
        let changed
        if (isValid) {
          changed = update(val)
        }
        if (!IS_PROD && !preventLog) {
          log.info(
            `${logName} ${isValid ? '✅' : '🚫'} ..${Date.now() - start}ms`,
            ...(changed || []),
          )
        }
      }
      const start = Date.now()
      Root.__trackStateChanges.isActive = true

      let result
      reactionHelpers.setValue = val => {
        if (!reactionID) {
          throw SHARED_REJECTION_ERROR
        }
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
        if (err instanceof ReactionRejectionError || err instanceof ReactionTimeoutError) {
          if (!IS_PROD && options.log === 'all') {
            log.info(`${logName} [${curID}] cancelled`)
          }
          return
        }
        console.error(err)
        return
      }

      const globalChanged = Root.__trackStateChanges.changed
      Root.__trackStateChanges = {}

      // handle promises
      if (result instanceof Promise) {
        result
          .then(val => {
            if (!reactionID) {
              if (!IS_PROD && !preventLog) {
                log.info(`${logName} 🚫`)
              }
              // cancelled before finishing
              return
            }
            if (typeof val !== 'undefined') {
              updateAsyncValue(val)
            }
          })
          .catch(err => {
            if (err instanceof ReactionRejectionError || err instanceof ReactionTimeoutError) {
              if (!IS_PROD) {
                log.verbose(`${logName} [${curID}] cancelled`)
              }
            } else {
              console.log(`throwing err from ${logName}`, err)
              throw new Error(err)
            }
          })
        return
      }

      const changed = update(result)

      if (!IS_PROD && !preventLog && !delayValue) {
        if (globalChanged && Object.keys(globalChanged).length) {
          logState.info(`${logName}`, reactValArg, ...logRes(result), globalChanged)
        } else {
          if (options.log !== 'state') {
            log.info(
              `${logName}`,
              ...(isReaction ? ['\n        args:', reactValArg] : []),
              ...(changed || []),
            )
          }
        }
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
