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

type ReactionFn<A, B> = ((a: A, helpers: ReactionHelpers) => B | Promise<B>)

// single reaction "autorun" style
// react(() => 1, { ...opts })
export function react<A extends ReactVal, B>(
  a: ReactionFn<A, B>,
  b?: ReactionOptions,
): UnwrapObservable<B>

// derive first, then react "reaction" style
// react(() => now(), t => t - 1000, { ...opts })
export function react<A extends ReactVal, B>(
  a: (() => A),
  b?: ReactionFn<A, B>,
  c?: ReactionOptions,
): UnwrapObservable<B>

export function react(a: any, b?: any, c?: any) {
  const startReaction = (obj: any, method: string) => {
    if (!b || b.constructor.name === 'Object') {
      return setupReact(obj, method, a, null, b as ReactionOptions)
    }
    if (typeof b === 'function') {
      return setupReact(obj, method, a, b, c)
    }
    throw new Error(`Bad reaction args ${a} ${b} ${c}`)
  }
  startReaction.isAutomagicReaction = true
  startReaction.reactionOptions = typeof b === 'object' ? b : c
  return startReaction as any
}

export const SHARED_REJECTION_ERROR = new ReactionRejectionError()
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
  let currentValueUnreactive // for dev mode comparing previous value without triggering reaction
  let previousValue: any
  let stopReaction: Function | null = null
  let disposed = false
  let subscriber: Subscription

  // state allows end-users to track certain things in complex reactions
  // for now its just `hasResolvedOnce` which lets them do things on first run
  const state = {
    hasResolvedOnce: false,
  }

  function update(value: any) {
    let nextValue = value

    // delayValue option
    if (delayValue) {
      nextValue = previousValue
      previousValue = value
    } else {
      previousValue = currentValueUnreactive
    }

    state.hasResolvedOnce = true

    // subscribable handling
    if (automagicConfig.isSubscribable) {
      // cancel previous
      if (subscriber) {
        subscriber.unsubscribe()
        subscriber = null
      }
      // subscribe to new one and use that instead of setting directly
      if (automagicConfig.isSubscribable(value)) {
        subscriber = (value as SubscribableLike).subscribe(next => {
          obj[methodName] = next
        })
        obj.__automagic.subscriptions.add({
          dispose: () => subscriber && subscriber.unsubscribe(),
        })
        return
      }
    }

    if (delayValue) {
      console.log('set it to', nextValue)
    }

    if (nextValue === currentValueUnreactive) {
      return
    }

    let changed: any

    // dev mode logging helpers
    if (process.env.NODE_ENV === 'development') {
      changed = [previousValue, nextValue]
    }

    currentValueUnreactive = nextValue
    obj[methodName] = nextValue
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
  obj.__automagic.subscriptions.add({ dispose })

  // state used outside each watch/reaction
  let reactionID = null
  let rejections = []

  const reset = () => {
    rejections.map(rej => rej())
    rejections = []
    reactionID = null
  }

  const useEffect = (effectFn: EffectCallback) => {
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
    getValue: () => obj[methodName],
    setValue: voidFn,
    sleep,
    when,
    whenChanged,
    state,
    useEffect,
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
        throw err
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
              throw err
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
}
