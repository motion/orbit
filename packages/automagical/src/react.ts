import { Reaction } from './constants'
import { ReactionOptions, ReactionHelpers } from './types'
import { ensure } from './ensure'
import { cancel } from './cancel'

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

export type ReactionFunction<A, B> = {
  (
    a: () => A,
    b?: ((a: A, helpers: ReactionHelpers) => B | Promise<B>) | ReactionOptions,
    c?: ReactionOptions,
  ): B
  cancel: Error
  ensure: (message: string, condition: boolean) => void
}

// @watch decorator
export const react = <ReactionFunction<any, any>>(
  function react(
    a,
    b?: ReactionOptions | Function,
    c?: ReactionOptions,
    opts?: ReactionOptions,
  ) {
    if (typeof a === 'function') {
      if (typeof b === 'function') {
        return new Reaction(a, b, c)
      }
      if (typeof b === 'object' || !b) {
        return new Reaction(a, b, null)
      }
    }
    // passing options
    if (!b) {
      const options = { ...a, ...opts }
      return (target, method, descriptor) => {
        if (!descriptor) {
          return tsWatch(options)
        }
        return doWatch(target, method, descriptor, options)
      }
    } else {
      // typescript
      if (!c) {
        return tsWatch(a)
      }
      return doWatch(a, b, c, opts)
    }
  }
)

react.cancel = cancel
react.ensure = ensure

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
