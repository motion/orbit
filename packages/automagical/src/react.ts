import Observable from 'zen-observable'

import { createReaction } from './createReaction'
import { MagicalObject, ReactionHelpers, ReactionOptions } from './types'

export type UnwrapObservable<A> = A extends Observable<infer U> ? U : A

export type ReactVal =
  | void
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

export type ReactionFn<A, B> = (a: A, helpers: ReactionHelpers) => B | Promise<B>

// derive first, then react "reaction" style
// react(() => now(), t => t - 1000, { ...opts })
export function react<A extends ReactVal, B>(
  a: () => A,
  b: ReactionFn<A, B>,
  c?: ReactionOptions,
): UnwrapObservable<B>

// single reaction "autorun" style
// react(() => 1, { ...opts })
export function react<A extends ReactVal>(
  a: (helpers: ReactionHelpers) => A,
  b?: ReactionOptions,
): UnwrapObservable<A>

export function react(a: any, b?: any, c?: any) {
  const startReaction = (obj: any, method: string) => {
    if (!b || b.constructor.name === 'Object') {
      return setupReact(obj, method, a, null, b as ReactionOptions)
    }
    if (typeof b === 'function') {
      return setupReact(obj, method, a, b.bind(obj), c)
    }
    throw new Error(`Bad reaction args ${a} ${b} ${c}`)
  }
  startReaction.isAutomagicReaction = true
  startReaction.reactionOptions = typeof b === 'object' ? b : c
  return startReaction as any
}

// watches values in an autorun, and resolves their results
export function setupReact(
  obj: MagicalObject,
  methodName: string,
  reaction: any,
  derive: Function | null,
  opts: ReactionOptions,
) {
  return createReaction(reaction, derive, opts, {
    ...getReactionNames(obj, methodName, opts),
    addSubscription(dispose) {
      obj.__automagic.subscriptions.add({ dispose })
    },
    setValue(next) {
      obj[methodName] = next
    },
    getValue() {
      return obj[methodName]
    },
  })
}

// TODO i want to make a helper so we can make any function a reaction easily
// solves for a good pattern, started it here but problem is how do you pass in helpers?
// both are weird:

/**
 * Potential answer: use generators :)
 *
 * Fixes every problem I've had at the expense of being a little "wierd" (rarely used).
 *
 *   1. encourages naming your reaction using function name
 *   2. no more need for special helper functions, yield can cancel anywhere
 *   3. we can even yield values back intermediately instead of setValue
 *   4. `yield` undefined could be getValue, perhaps
 *   5.
 *
 * react(function *myReaction() {
 *   yield when(() => {})
 * })
 *
 */

/**
 * class X {
 *   x = reactFn(helpers => (...args) => { })
 *  }
 *
 *  or
 *
 *  class X {
 *    x = reactFn(([...args], helpers) => { })
 *  }
 * }
 */
// export function reactFn<A extends ReactionFn<any, any>>(a: A): A {
//   let lastCallProps = observable.box<any[]>([])

//   return createReaction(reaction, derive, opts, {
//     ...getReactionNames(obj, methodName, opts),
//     addSubscription(dispose) {
//       obj.__automagic.subscriptions.add({ dispose })
//     },
//     setValue(next) {
//       obj[methodName] = next
//     },
//     getValue() {
//       return obj[methodName]
//     },
//   })
// }

const getReactionNames = (obj: any, methodName: string, opts: ReactionOptions) => {
  const delayName =
    opts && typeof opts.delay === 'number' && opts.delay >= 0 ? ` ..${opts.delay}ms ` : ''
  const storeName = obj.constructor.name
  return {
    name: `${storeName}.${methodName}${delayName}`,
    nameFull: getDescriptiveMethodName(obj, methodName),
  }
}

const getDescriptiveMethodName = (obj: any, methodName: string) => {
  const storeName = obj.constructor.name
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
}
