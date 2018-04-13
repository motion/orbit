function validWatch(val) {
  return Array.isArray(val) || typeof val === 'function'
}

function attachWatch(val, userOptions) {
  val.IS_AUTO_RUN = userOptions
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

// @watch decorator
export function watch(a, b, c, opts) {
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
    console.log(a, b, c, opts)
    return doWatch(a, b, c, opts)
  }
}

export const react = watch

// @ts-ignore
watch.if = function watchIf(a, b, c) {
  // passing options
  if (!b) {
    return (d, e, f) => watch(d, e, f, { isIf: true, ...a })
  }
  return watch(a, b, c, { isIf: true })
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
