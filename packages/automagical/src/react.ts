import { Reaction } from './constants'
import { ReactionOptions, ReactionHelpers } from './types'

// decorator to do reactions

function validWatch(val) {
  return Array.isArray(val) || typeof val === 'function'
}

function attachWatch(val, userOptions) {
  val.IS_AUTO_RUN = userOptions || true
  return val
}

function tsWatch(options) {
  const autorungetter = () => {}
  // @ts-ignore
  autorungetter.IS_AUTO_RUN = true
  // @ts-ignore
  autorungetter.options = options
  return {
    set(value) {
      // @ts-ignore
      autorungetter.value = value
    },
    get: autorungetter,
  }
}

type ReactVal =
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

// @react decorator
export function react<A extends ReactVal, B>(
  a: () => A,
  b?: ((a: A, helpers: ReactionHelpers) => B | Promise<B>) | ReactionOptions,
  c?: ReactionOptions,
  opts?: ReactionOptions,
): B {
  if (typeof a === 'function') {
    if (typeof b === 'function') {
      // @ts-ignore
      return new Reaction(a, b, c)
    }
    if (typeof b === 'object' || !b) {
      // @ts-ignore
      return new Reaction(a, b, null)
    }
  }
  // passing options
  if (!b) {
    console.log('no b???', a, b, c)
    debugger
    // @ts-ignore
    const options = { ...a, ...opts }
    // @ts-ignore
    return (target, method, descriptor) => {
      if (!descriptor) {
        return tsWatch(options)
      }
      return doWatch(target, method, descriptor, options)
    }
  } else {
    // typescript
    if (!c) {
      // @ts-ignore
      return tsWatch(a)
    }
    return doWatch(a, b, c, opts)
  }
}

function doWatch(target, _, descriptor, userOptions) {
  // non-decorator
  if (validWatch(target)) {
    return attachWatch(target, userOptions)
  }
  // decorator
  if (descriptor.initializer) {
    const ogInit = descriptor.initializer
    return {
      ...descriptor,
      configurable: true,
      initializer: function() {
        const value = ogInit.call(this)
        if (validWatch(value)) {
          return attachWatch(value, userOptions)
        } else {
          console.log('got a', descriptor, value)
          throw 'Expected a function or array to watch'
        }
      },
    }
  }
}
