function validWatch(val) {
  return Array.isArray(val) || typeof val === 'function'
}

function attachWatch(val, userOptions) {
  val.IS_AUTO_RUN = userOptions || true
  return val
}

function tsWatch(target, options) {
  const autorungetter = () => {}
  autorungetter.IS_AUTO_RUN = true
  autorungetter.options = options
  return {
    set(value) {
      autorungetter.value = value
    },
    get: autorungetter,
  }
}

// @watch decorator
export default function watch(a, b, c) {
  // passing options
  if (!b) {
    const options = a
    return (target, method, descriptor) => {
      if (!descriptor) {
        return tsWatch(target, options)
      }
      return doWatch(target, method, descriptor, options)
    }
  } else {
    if (!c) {
      return tsWatch(a)
    }
    return doWatch(a, b, c)
  }
}

function doWatch(target, method, descriptor, userOptions) {
  // non-decorator
  if (validWatch(target)) {
    return attachWatch(target, userOptions)
  }
  // decorator
  // console.log('descriptor', target, method, descriptor)
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
