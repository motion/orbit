import * as Mobx from 'mobx'

import { automagicConfig } from './AutomagicalConfiguration'
import { ReactionRejectionError, ReactionTimeoutError } from './constants'
import { getReactionOptions, log, logGroup } from './helpers'
import { SHARED_REJECTION_ERROR } from './react'
import { EffectCallback, ReactionHelpers, ReactionOptions } from './types'

const voidFn = () => void 0

type Subscription = { unsubscribe: Function }
type SubscribableLike = { subscribe: (a: any) => Subscription }

type ReactionConfig = {
  getValue: () => any
  setValue: Function
  addSubscription: Function
  name: string
  nameFull: string
}

// watches values in an autorun, and resolves their results
export function createReaction(
  reaction: any,
  derive: Function | null,
  userOptions: ReactionOptions | null,
  config: ReactionConfig,
) {
  const isReaction = !!derive

  if (typeof reaction !== 'function') {
    throw new Error(`Reaction requires function, got ${typeof reaction}.`)
  }
  if (isReaction) {
    if (typeof derive !== 'function') {
      throw new Error(`Reaction requires second function, got ${typeof derive}.`)
    }
  }

  const localSettingLog = () => {
    return +((typeof localStorage !== 'undefined' && localStorage.getItem('enableLog')) || 0)
  }

  const { delayValue, lazy, delay, ...options } = getReactionOptions(userOptions)
  let mobxOptions = options as Mobx.IReactionOptions
  // we run immediately by default
  // its the 95% use case and causes less bugs
  mobxOptions.fireImmediately = !lazy
  mobxOptions.name = config.name
  if (typeof delay === 'number') {
    mobxOptions.delay = delay
  }

  let id = lazy ? 1 : 0
  const shouldLog = () => options.log !== false || localSettingLog() > 0
  let currentValueUnreactive: any // for comparing previous value without triggering reaction
  let previousValue: any
  let stopReaction: Function | null = null
  let disposed = false
  let subscriber: Subscription | null = null
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
        subscriber = (value as SubscribableLike).subscribe(config.setValue)
        config.addSubscription(() => subscriber && subscriber.unsubscribe())
        return
      }
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
    config.setValue(nextValue)
    return changed
  }

  config.addSubscription(() => {
    // clear reactionID
    reactionID = null
    if (disposed) return
    if (stopReaction) stopReaction()
    disposed = true
  })

  // state used outside each watch/reaction
  let reactionID: number | null = null
  let rejections: Function[] = []

  const reset = () => {
    rejections.forEach(rej => rej())
    rejections = []
    reactionID = null
  }

  const useEffect = (effectFn: EffectCallback) => {
    return new Promise((resolve, reject) => {
      let cancellation: any
      const finish = (success: boolean) => () => {
        cancellation()
        if (success) {
          resolve()
        } else {
          reject(SHARED_REJECTION_ERROR)
        }
      }
      const cancel = finish(false)
      cancellation = effectFn(finish(true), cancel)
      rejections.push(cancel)
    })
  }

  const sleep = (ms = 0): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!reactionID) {
        reject(SHARED_REJECTION_ERROR)
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
    let curVal: any
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
    getValue: config.getValue,
    setValue: voidFn,
    sleep,
    when,
    whenChanged,
    state,
    useEffect,
  }

  const updateAsyncValue = (start: number, reactValArg: any, isValid: boolean, val: any) => {
    let changed: any
    if (isValid) {
      // more verbose logging in dev
      changed = update(val)
    } else {
      throw SHARED_REJECTION_ERROR
    }
    if (process.env.NODE_ENV === 'development') {
      // async updates log with an indicator of their delay time and if they cancelled
      if (shouldLog()) {
        const timedLog = `..${Date.now() - start}ms`
        const delayValLog = delayValue ? ` [delayValue]` : ''
        logGroup({
          name: config.nameFull,
          result: val,
          changed,
          timings: `   [${timedLog}]${delayValLog} ${isValid ? '✅' : '🚫'}`,
          reactionArgs: isReaction ? reactValArg : null,
        })
      }
    }
  }

  function setupReactionFn(reactionFn: Function) {
    return function magicReaction(reactValArg: any) {
      reset()
      const start = Date.now()
      id = id + 1
      reactionID = id
      let curID = reactionID
      let result: any

      // async update helpers
      const updateAsync = val => updateAsyncValue(start, reactValArg, curID === reactionID, val)
      reactionHelpers.setValue = updateAsync

      // to allow cancels
      try {
        // single function reactions get helpers directly
        // value reactions get the value and helpers second
        result = reactionFn(isReaction ? reactValArg : reactionHelpers, reactionHelpers)
      } catch (err) {
        // could be some setTimeouts or something, ensure its still cancelled
        curID = -1
        // got a nice cancel!
        if (err instanceof ReactionRejectionError || err instanceof ReactionTimeoutError) {
          // if (!IS_PROD) {
          //   log.verbose(`  ${config.name} [${curID}] cancelled: ${err.message}`)
          // }
          return
        }
        throw err
      }

      // handle promises
      if (result instanceof Promise) {
        result
          .then(val => {
            if (curID !== reactionID) {
              if (process.env.NODE_ENV !== 'production') {
                if (shouldLog()) {
                  log.verbose(`${config.name} 🚫`)
                }
              }
              // cancelled before finishing
              return
            }
            if (typeof val !== 'undefined') {
              updateAsync(val)
            }
          })
          .catch(err => {
            if (err instanceof ReactionRejectionError || err instanceof ReactionTimeoutError) {
              // if (!IS_PROD) {
              //   log.verbose(`${config.name} [${curID}] cancelled`)
              // }
            } else {
              throw err
            }
          })
        return
      }

      const changed = update(result)

      // only log after first run, we could have a way to log this still
      if (reactionID > 1) {
        if (process.env.NODE_ENV !== 'production') {
          if (shouldLog()) {
            if (changed) {
              logGroup({
                name: config.nameFull,
                result,
                changed,
                reactionArgs: reactValArg,
              })
            }
          }
        }
      }
    }
  }

  if (isReaction) {
    if (derive) {
      stopReaction = Mobx.reaction(reaction, setupReactionFn(derive), mobxOptions)
    }
  } else {
    stopReaction = Mobx.autorun(setupReactionFn(reaction), mobxOptions)
  }
}
