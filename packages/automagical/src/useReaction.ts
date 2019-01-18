// import * as Mobx from 'mobx'
// import { useEffect, useMemo } from 'react'
// import { ReactionRejectionError, ReactionTimeoutError } from './constants'
// import { diffLog, getReactionOptions, log, logGroup, toJSDeep } from './helpers'
// import { ReactVal, UnwrapObservable } from './react'
// import { EffectCallback, ReactionHelpers, ReactionOptions } from './types'

// const SHARED_REJECTION_ERROR = new ReactionRejectionError()
// const IS_PROD = process.env.NODE_ENV !== 'development'
// const voidFn = () => void 0

// // TODO come back to this
// // this will require some thought
// // the a/b functions will be a PIA to have to memo every one
// // but without that will have to "update" them every render...
// // and doing memoKeys differently than every other hook is a weird option (auto-memo)
// // so have to figure out

// export function useReaction<A extends ReactVal, B>(
//   a: () => A,
//   b?: ((a: A, helpers: ReactionHelpers) => B | Promise<B>) | ReactionOptions,
//   c?: ReactionOptions | any[],
//   d?: any[],
// ): UnwrapObservable<B> {
//   const [state, dispose] = useMemo(() => useReactionSetup(a, b, c), memoKeys)

//   // dispose
//   useEffect(() => {
//     return () => {
//       clearTimeout(runTm)
//       if (disposed) return
//       if (stopReaction) {
//         stopReaction()
//       }
//       disposed = true
//     }
//   }, [])

//   return current.get()
// }

// function useReactionSetup<A extends ReactVal, B>(
//   a: () => A,
//   b?: ((a: A, helpers: ReactionHelpers) => B | Promise<B>) | ReactionOptions,
//   c?: ReactionOptions,
// ): UnwrapObservable<B> {
//   const isReaction = typeof b === 'function'
//   const opts = typeof b === 'function' ? c : b
//   const {
//     delayValue,
//     defaultValue,
//     deferFirstRun,
//     trace,
//     ...options
//   } = getReactionOptions(opts)
//   const mobxOptions = options as Mobx.IReactionOptions
//   mobxOptions.fireImmediately = !deferFirstRun
//   let id = deferFirstRun ? 1 : 0

//   let preventLog = options.log === false
//   let current = Mobx.observable.box(defaultValue, {
//     name: 'Reaction',
//     deep: false,
//   })
//   let currentValueUnreactive // for dev mode comparing previous value without triggering reaction
//   let previousValue
//   let stopReaction
//   let disposed = false

//   // state allows end-users to track certain things in complex reactions
//   // for now its just `hasResolvedOnce` which lets them do things on first run
//   const state = {
//     hasResolvedOnce: false,
//   }

//   function getCurrentValue() {
//     return current.get()
//   }

//   function update(value) {
//     let nextValue = value

//     // delayValue option
//     if (delayValue) {
//       nextValue = previousValue
//       previousValue = value
//     } else if (process.env.NODE_ENV === 'development') {
//       // only care about previousValue for logging, and only log in development
//       previousValue = currentValueUnreactive
//     }

//     state.hasResolvedOnce = true

//     // return diff in dev mode
//     let changed: string

//     // dev mode logging helpers
//     if (process.env.NODE_ENV === 'development') {
//       currentValueUnreactive = nextValue
//       changed = diffLog(toJSDeep(previousValue), toJSDeep(nextValue))
//     }

//     current.set(nextValue)
//     return changed
//   }

//   const runTm = setTimeout(() => {
//     if (isReaction) {
//       if (typeof b !== 'function') {
//         throw new Error(`Reaction requires second function. ${'Reaction'} got ${typeof b}`)
//       }
//       // reaction
//       stopReaction = Mobx.reaction(a, setupReactionFn(b), mobxOptions)
//     } else {
//       if (typeof a !== 'function') {
//         throw new Error(`Reaction requires function. ${'Reaction'} got ${typeof a}`)
//       }
//       //autorun
//       stopReaction = Mobx.autorun(setupReactionFn(a), mobxOptions)
//     }
//   }, 0)

//   // state used outside each watch/reaction
//   let reactionID = null
//   let rejections = []

//   const reset = () => {
//     rejections.map(rej => rej())
//     rejections = []
//     reactionID = null
//   }

//   const preventLogging = () => {
//     preventLog = true
//   }

//   const onCancel = cb => {
//     rejections.push(cb)
//   }

//   const effect = (effectFn: EffectCallback) => {
//     return new Promise((resolve, reject) => {
//       let cancellation
//       const finish = (success: boolean) => () => {
//         cancellation()
//         if (success) {
//           resolve()
//         } else {
//           reject(SHARED_REJECTION_ERROR)
//         }
//       }
//       cancellation = effectFn(finish(true), finish(false))
//       rejections.push(finish(false))
//     })
//   }

//   const sleep = (ms: number): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       if (!reactionID) {
//         reject(SHARED_REJECTION_ERROR)
//         return
//       }
//       if (typeof ms === 'undefined') {
//         resolve()
//         return
//       }
//       const sleepTimeout = setTimeout(() => resolve(), ms)
//       rejections.push(() => {
//         clearTimeout(sleepTimeout)
//         reject(SHARED_REJECTION_ERROR)
//       })
//     })
//   }

//   const idle = (): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       // @ts-ignore
//       let handle = requestIdleCallback(resolve)
//       rejections.push(() => {
//         // @ts-ignore
//         cancelIdleCallback(handle)
//         reject(SHARED_REJECTION_ERROR)
//       })
//     })
//   }

//   const when = (condition: () => boolean, timeout?: number): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       let cancelTm
//       if (!reactionID) {
//         return reject(SHARED_REJECTION_ERROR)
//       }
//       let cancelWhen = false
//       Mobx.when(condition)
//         .then(() => {
//           if (cancelWhen) return
//           clearTimeout(cancelTm)
//           resolve()
//         })
//         .catch(() => {
//           clearTimeout(cancelTm)
//           reject()
//         })
//       if (timeout) {
//         cancelTm = setTimeout(() => {
//           reject(new ReactionTimeoutError('Timed out'))
//         }, timeout)
//       }
//       const cancel = () => {
//         clearTimeout(cancelTm)
//         cancelWhen = true
//         reject(SHARED_REJECTION_ERROR)
//       }
//       rejections.push(cancel)
//     })
//   }

//   const whenChanged = <A>(condition: () => A, dontCompare?): Promise<A> => {
//     let oldVal = condition()
//     let curVal
//     return new Promise((resolve, reject) => {
//       if (!reactionID) {
//         return reject(SHARED_REJECTION_ERROR)
//       }
//       let cancelWhen = false
//       Mobx.when(() => {
//         curVal = condition()
//         if (dontCompare) {
//           return true
//         }
//         return !Mobx.comparer.structural(curVal, oldVal)
//       })
//         .then(() => {
//           if (cancelWhen) {
//             return
//           }
//           resolve(curVal)
//         })
//         .catch(reject)
//       rejections.push(() => {
//         cancelWhen = true
//         reject(SHARED_REJECTION_ERROR)
//       })
//     })
//   }

//   const reactionHelpers: ReactionHelpers = {
//     preventLogging,
//     getValue: getCurrentValue,
//     setValue: voidFn,
//     sleep,
//     when,
//     whenChanged,
//     state,
//     idle,
//     onCancel,
//     effect,
//   }

//   function setupReactionFn(reactionFn) {
//     return function reaction(reactValArg) {
//       reset()
//       id = id + 1
//       reactionID = id
//       let curID = reactionID
//       const start = Date.now()

//       let result

//       // async update helpers
//       const updateAsyncValue = val => {
//         const isValid = curID === reactionID
//         let changed
//         if (isValid) {
//           // more verbose logging in dev
//           changed = update(val)
//         } else {
//           throw SHARED_REJECTION_ERROR
//         }
//         if (process.env.NODE_ENV === 'development') {
//           // async updates log with an indicator of their delay time and if they cancelled
//           if (log && !preventLog) {
//             const timedLog = `..${Date.now() - start}ms`
//             const delayValLog = delayValue ? ` [delayValue]` : ''
//             logGroup({
//               name: 'Reaction',
//               result: val,
//               changed,
//               timings: `   [${timedLog}]${delayValLog} ${isValid ? '✅' : '🚫'}`,
//               reactionArgs: isReaction ? reactValArg : null,
//             })
//           }
//         }
//       }
//       reactionHelpers.setValue = updateAsyncValue

//       // to allow cancels
//       try {
//         result = reactionFn.call(
//           obj,
//           // single function reactions get helpers directly
//           // value reactions get the value and helpers second
//           isReaction ? reactValArg : reactionHelpers,
//           reactionHelpers,
//         )
//       } catch (err) {
//         // could be some setTimeouts or something, ensure its still cancelled
//         curID = -1
//         // got a nice cancel!
//         if (err instanceof ReactionRejectionError || err instanceof ReactionTimeoutError) {
//           if (!IS_PROD) {
//             log.verbose(`  ${'Reaction'} [${curID}] cancelled: ${err.message}`)
//           }
//           return
//         }
//         console.error(err)
//         return
//       }

//       // handle promises
//       if (result instanceof Promise) {
//         result
//           .then(val => {
//             if (curID !== reactionID) {
//               if (!IS_PROD && !preventLog) {
//                 log.verbose(`${'Reaction'} 🚫`)
//               }
//               // cancelled before finishing
//               return
//             }
//             if (typeof val !== 'undefined') {
//               updateAsyncValue(val)
//             }
//           })
//           .catch(err => {
//             if (err instanceof ReactionRejectionError || err instanceof ReactionTimeoutError) {
//               if (!IS_PROD) {
//                 log.verbose(`${'Reaction'} [${curID}] cancelled`)
//               }
//             } else {
//               console.log(`reaction error in ${name.simple}`)
//               console.error(err)
//             }
//           })
//         return
//       }

//       const changed = update(result)

//       // only log after first run, we could have a way to log this still
//       if (reactionID > 1) {
//         if (!IS_PROD && !preventLog) {
//           if (changed) {
//             logGroup({
//               name: 'Reaction',
//               result,
//               changed: `${changed}`,
//               reactionArgs: reactValArg,
//             })
//           }
//         }
//       }
//     }
//   }

//   // dispose
//   useEffect(() => {
//     return () => {
//       clearTimeout(runTm)
//       if (disposed) return
//       if (stopReaction) {
//         stopReaction()
//       }
//       disposed = true
//     }
//   }, [])

//   return current.get()
// }
