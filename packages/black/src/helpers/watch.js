// @flow

// @watch decorator
export default function watch(
  target: Object,
  method: string,
  descriptor: Object
) {
  // non-decorator
  if (typeof target === 'function') {
    target.IS_AUTO_RUN = true
    return target
  }

  // decorator
  if (descriptor.initializer) {
    const ogInit = descriptor.initializer
    return {
      ...descriptor,
      configurable: true,
      initializer: function() {
        const value = ogInit.call(this)
        if (typeof value !== 'function') {
          throw 'Expected a function to watch'
        }
        value.IS_AUTO_RUN = true
        return value
      },
    }
  }
}
