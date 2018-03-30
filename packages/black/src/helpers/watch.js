// @flow

function validWatch(val) {
  return Array.isArray(val) || typeof val === 'function'
}

function attachWatch(val, userOptions) {
  val.IS_AUTO_RUN = userOptions || true
  return val
}

// @watch decorator
export default function watch(a, b, c) {
  // passing options
  if (!b) {
    const options = a
    return (target, method, _descriptor) => {
      let descriptor = _descriptor
      const autorungetter = () => {}
      autorungetter.IS_AUTO_RUN = true
      autorungetter.options = options
      if (!descriptor) {
        return {
          set(value) {
            console.log('set to', value)
            autorungetter.value = value
          },
          get: autorungetter,
        }
      }
      return doWatch(target, method, descriptor, options)
    }
  } else {
    if (!c) {
      return {
        set(value) {
          console.log('set to', value)
        },
      }
    }
    return doWatch(a, b, c)
  }
}

function doWatch(
  target: Object,
  method: string,
  descriptor: Object,
  userOptions?: Object,
) {
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
