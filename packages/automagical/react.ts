import { Reaction, ReactionRejectionError } from './constants'
import { ReactionOptions } from './types'

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

// type ReactionFunction<B> = {
//   (a: Function, b?: Function, c?: Object): ReturnType<B>
//   cancel: Error
// }

// @watch decorator
export const react = /*<ReactionFunction<any>>*/ function react(
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

// @ts-ignore
react.cancel = new ReactionRejectionError()

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
