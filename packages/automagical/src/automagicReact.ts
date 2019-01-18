import * as Mobx from 'mobx'
import { AutomagicOptions } from './automagical'
import { ReactionRejectionError, ReactionTimeoutError } from './constants'
import { diffLog, getReactionName, getReactionOptions, log, logGroup, toJSDeep } from './helpers'
import { EffectCallback, MagicalObject, ReactionHelpers } from './types'

const SHARED_REJECTION_ERROR = new ReactionRejectionError()
const IS_PROD = process.env.NODE_ENV !== 'development'
const voidFn = () => void 0

type Subscription = { unsubscribe: Function }
type SubscribableLike = { subscribe: (a: any) => Subscription }

let lastStoreLogName = ''

const whiteSpaceOfLen = (number: number) => {
  let str = ''
  for (let i = 0; i < number; i++) {
    str += ' '
  }
  return str
}

// watches values in an autorun, and resolves their results
export function automagicReact(
  obj: MagicalObject,
  method,
  val,
  userOptions,
  automagicOptions: AutomagicOptions,
) {
  const {
    delayValue,
    defaultValue,
    onlyUpdateIfChanged,
    deferFirstRun,
    trace,
    ...options
  } = getReactionOptions({
    name: method,
    ...userOptions,
  })
  const isReaction = Array.isArray(val)

  let mobxOptions = options as Mobx.IReactionOptions
  let id = deferFirstRun ? 1 : 0

  // we run immediately by default
  // its the 95% use case and causes less bugs
  mobxOptions.fireImmediately = !deferFirstRun

  // name for logs
  const delayName = options && options.delay >= 0 ? ` ..${options.delay}ms ` : ''
  const storeName = getReactionName(obj)
  const methodName = `${method}`
  const name = {
    simple: `${storeName}.${methodName}${delayName}`,
    // nice name that shows some prop info for instance...
    get full() {
      const props = obj.props
      if (props) {
        let res = ''
        for (const prop of ['id', 'index', 'name', 'title']) {
          const val = props[prop]
          if (typeof val === 'string' || typeof val === 'number') {
            res += `${prop}: ${val}`
            break
          }
        }
        if (res.length) {
          return `${storeName}(${res}).${methodName}`
        }
      }
      const name = `${storeName}.${methodName}`
      // fancy log that doesn't show the name if multiple logs in a row
      if (storeName === lastStoreLogName) {
        return `${whiteSpaceOfLen(storeName.length)}.${methodName}`
      } else {
        lastStoreLogName = storeName
        return name
      }
    },
  }

  let preventLog = options.log === false
  let current = Mobx.observable.box(defaultValue, {
    name: name.simple,
    deep: false,
  })
  let currentValueUnreactive // for dev mode comparing previous value without triggering reaction
  let previousValue
  let stopReaction
  let disposed = false
  let subscriber: Subscription

  // state allows end-users to track certain things in complex reactions
  // for now its just `hasResolvedOnce` which lets them do things on first run
  const state = {
    hasResolvedOnce: false,
  }

  function getCurrentValue() {
    return current.get()
  }

  function update(value) {
    let nextValue = value

    // delayValue option
    if (delayValue) {
      nextValue = previousValue
      previousValue = value
    } else if (process.env.NODE_ENV === 'development') {
      // only care about previousValue for logging, and only log in development
      previousValue = currentValueUnreactive
    }

    state.hasResolvedOnce = true

    // subscribable handling
    if (automagicOptions && automagicOptions.isSubscribable) {
      // for subscribable support
      // cancel previous whenever a new one comes in
      const newSubscriber = value as SubscribableLike
      if (subscriber) {
        subscriber.unsubscribe()
        subscriber = null
      }
      // subscribe to new one and use that instead of setting directly
      if (automagicOptions.isSubscribable(value)) {
        if (!obj.subscriptions) {
          console.error('store', obj, obj.subscriptions)
          throw new Error(
            "Detected a subscribable but store doesn't have a .subscriptions CompositeDisposable",
          )
        }
        subscriber = newSubscriber.subscribe(value => {
          current.set(value)
        })
        obj.subscriptions.add({
          dispose: () => {
            if (subscriber) {
              subscriber.unsubscribe()
            }
          },
        })
        return 'new subscriber'
      }
    }

    // return diff in dev mode
    let changed: string

    // dev mode logging helpers
    if (process.env.NODE_ENV === 'development') {
      currentValueUnreactive = nextValue
      changed = diffLog(toJSDeep(previousValue), toJSDeep(nextValue))
    }

    current.set(nextValue)
    return changed
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

  function run() {
    setTimeout(() => {
      if (disposed) {
        // this avoids work/bugs by cancelling reactions after disposed
        return
      }
      if (isReaction) {
        if (typeof val[1] !== 'function') {
          throw new Error(`Reaction requires second function. ${name.simple} got ${typeof val}`)
        }
        // reaction
        stopReaction = Mobx.reaction(val[0], setupReactionFn(val[1]), mobxOptions)
      } else {
        if (typeof val !== 'function') {
          throw new Error(`Reaction requires function. ${name.simple} got ${typeof val}`)
        }
        //autorun
        stopReaction = Mobx.autorun(setupReactionFn(val), mobxOptions)
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

  const onCancel = cb => {
    rejections.push(cb)
  }

  const effect = (effectFn: EffectCallback) => {
    return new Promise((resolve, reject) => {
      let cancellation
      const finish = (success: boolean) => () => {
        cancellation()
        if (success) {
          resolve()
        } else {
          reject(SHARED_REJECTION_ERROR)
        }
      }
      cancellation = effectFn(finish(true), finish(false))
      rejections.push(finish(false))
    })
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

  const idle = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      let handle = requestIdleCallback(resolve)
      rejections.push(() => {
        // @ts-ignore
        cancelIdleCallback(handle)
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
          reject(new ReactionTimeoutError('Timed out'))
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
    idle,
    onCancel,
    effect,
  }

  function setupReactionFn(reactionFn) {
    return function reaction(reactValArg) {
      reset()
      id = id + 1
      reactionID = id
      let curID = reactionID
      const start = Date.now()

      let result

      // async update helpers
      const updateAsyncValue = val => {
        const isValid = curID === reactionID
        let changed
        if (isValid) {
          // more verbose logging in dev
          changed = update(val)
        } else {
          throw SHARED_REJECTION_ERROR
        }
        if (process.env.NODE_ENV === 'development') {
          // async updates log with an indicator of their delay time and if they cancelled
          if (log && !preventLog) {
            const timedLog = `..${Date.now() - start}ms`
            const delayValLog = delayValue ? ` [delayValue]` : ''
            logGroup({
              name: name.full,
              result: val,
              changed,
              timings: `   [${timedLog}]${delayValLog} ${isValid ? '✅' : '🚫'}`,
              reactionArgs: isReaction ? reactValArg : null,
            })
          }
        }
      }
      reactionHelpers.setValue = updateAsyncValue

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
        // could be some setTimeouts or something, ensure its still cancelled
        curID = -1
        // got a nice cancel!
        if (err instanceof ReactionRejectionError || err instanceof ReactionTimeoutError) {
          if (!IS_PROD) {
            log.verbose(`  ${name.simple} [${curID}] cancelled: ${err.message}`)
          }
          return
        }
        console.error(err)
        return
      }

      // handle promises
      if (result instanceof Promise) {
        result
          .then(val => {
            if (curID !== reactionID) {
              if (!IS_PROD && !preventLog) {
                log.verbose(`${name.simple} 🚫`)
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
                log.verbose(`${name.simple} [${curID}] cancelled`)
              }
            } else {
              console.log(`reaction error in ${name.simple}`)
              console.error(err)
            }
          })
        return
      }

      const changed = update(result)

      // only log after first run, we could have a way to log this still
      if (reactionID > 1) {
        if (!IS_PROD && !preventLog) {
          if (changed) {
            logGroup({
              name: name.full,
              result,
              changed: `${changed}`,
              reactionArgs: reactValArg,
            })
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
