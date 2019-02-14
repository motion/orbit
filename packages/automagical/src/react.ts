import * as Mobx from 'mobx'
import Observable from 'zen-observable'
import { automagicConfig } from './automagical'
import { ReactionRejectionError, ReactionTimeoutError } from './constants'
import { getReactionName, getReactionOptions, log, logGroup } from './helpers'
import { EffectCallback, MagicalObject, ReactionHelpers, ReactionOptions } from './types'

export type UnwrapObservable<A> = A extends Observable<infer U> ? U : A

export type ReactVal =
  | undefined
  | null
  | number
  | string
  | Object
  | [any]
  | [any, any]
  | [any, any, any]
  | [any, any, any, any]
  | [any, any, any, any, any]
  | [any, any, any, any, any, any]
  | [any, any, any, any, any, any, any]

// react() function decorator
export function react<A extends ReactVal, B>(
  a: () => A,
  b?: ((a: A, helpers: ReactionHelpers) => B | Promise<B>) | ReactionOptions,
  c: ReactionOptions = null,
): UnwrapObservable<B> {
  const startReaction = (obj: any, method: string) => {
    if (b === Object) {
      return setupReact(obj, method, a, null, b as ReactionOptions) as any
    }
    if (typeof b === 'function') {
      return setupReact(obj, method, a, b, c) as any
    }
    throw new Error(`Bad reaction args ${a} ${b} ${c}`)
  }
  startReaction.isAutomagicReaction = true
  return startReaction as any
}

const SHARED_REJECTION_ERROR = new ReactionRejectionError()
const IS_PROD = process.env.NODE_ENV !== 'development'
const voidFn = () => void 0

type Subscription = { unsubscribe: Function }
type SubscribableLike = { subscribe: (a: any) => Subscription }

// watches values in an autorun, and resolves their results
export function setupReact(
  obj: MagicalObject,
  methodName: string,
  reaction: any,
  derive: Function | null,
  userOptions: ReactionOptions,
) {
  const { delayValue, defaultValue, deferFirstRun, trace, ...options } = getReactionOptions(
    userOptions,
  )
  const isReaction = !!derive

  let mobxOptions = options as Mobx.IReactionOptions
  let id = deferFirstRun ? 1 : 0

  // we run immediately by default
  // its the 95% use case and causes less bugs
  mobxOptions.fireImmediately = !deferFirstRun

  // name for logs
  const delayName = options && options.delay >= 0 ? ` ..${options.delay}ms ` : ''
  if (!obj) {
    debugger
  }
  const storeName = getReactionName(obj)
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
      return `${storeName}.${methodName}`
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
    }

    previousValue = currentValueUnreactive
    state.hasResolvedOnce = true

    // subscribable handling
    if (automagicConfig.isSubscribable) {
      // for subscribable support
      // cancel previous whenever a new one comes in
      const newSubscriber = value as SubscribableLike
      if (subscriber) {
        subscriber.unsubscribe()
        subscriber = null
      }
      // subscribe to new one and use that instead of setting directly
      if (automagicConfig.isSubscribable(value)) {
        if (!obj.__automagicSubscriptions) {
          console.error('store', obj, obj.__automagicSubscriptions)
          throw new Error(
            "Detected a subscribable but store doesn't have a .__automagicSubscriptions CompositeDisposable",
          )
        }
        subscriber = newSubscriber.subscribe(value => {
          current.set(value)
        })
        obj.__automagicSubscriptions.add({
          dispose: () => {
            if (subscriber) subscriber.unsubscribe()
          },
        })
        return 'new subscriber'
      }
    }

    if (value === currentValueUnreactive) {
      return
    }

    let changed: any

    // dev mode logging helpers
    if (process.env.NODE_ENV === 'development') {
      changed = ['previous', previousValue, 'next', nextValue]
    }

    currentValueUnreactive = nextValue
    current.set(nextValue)
    return changed
  }

  function dispose() {
    // clear reactionID
    reactionID = null
    if (disposed) {
      return
    }
    if (stopReaction) {
      stopReaction()
    }
    disposed = true
  }

  // auto add subscription so it disposes on unmount
  if (!obj.__automagicSubscriptions) {
    debugger
  }
  obj.__automagicSubscriptions.add({ dispose })

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
        let changed: any
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
              changed,
              reactionArgs: reactValArg,
            })
          }
        }
      }
    }
  }

  if (typeof reaction !== 'function') {
    throw new Error(`Reaction requires function. ${name.simple} got ${typeof reaction}`)
  }
  if (isReaction) {
    if (typeof derive !== 'function') {
      throw new Error(`Reaction requires second function. ${name.simple} got ${typeof derive}`)
    }
    // reaction
    stopReaction = Mobx.reaction(reaction, setupReactionFn(derive), mobxOptions)
  } else {
    //autorun
    stopReaction = Mobx.autorun(setupReactionFn(reaction), mobxOptions)
  }

  return current
}
