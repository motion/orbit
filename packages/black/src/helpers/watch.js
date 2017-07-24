// @flow

function validWatch(val) {
  return Array.isArray(val) || typeof val === 'function'
}

function attachWatch(val) {
  val.IS_AUTO_RUN = true
  return val
}

// @watch decorator
export default function watch(
  target: Object,
  method: string,
  descriptor: Object
) {
  // non-decorator
  if (validWatch(target)) {
    return attachWatch(target)
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
          return attachWatch(value)
        } else {
          console.log('got a', descriptor, value)
          throw 'Expected a function or array to watch'
        }
      },
    }
  }
}
