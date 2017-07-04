// @flow
import { observable } from 'mobx'

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

  // decorate
  if (descriptor.initializer) {
    const { initializer, ...rest } = descriptor
    const value = initializer.call(target)

    if (typeof value !== 'function') {
      throw 'Expected a function to watch'
    }

    value.IS_AUTO_RUN = true

    return {
      ...rest,
      value,
    }
  }
  if (descriptor.value) {
    descriptor.value.IS_AUTO_RUN = true
    return descriptor
  }
}
