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

  if (descriptor.initializer) {
    const watchFn = descriptor.initializer.call(target)

    if (typeof watchFn !== 'function') {
      throw 'Expected a function to watch'
    }

    watchFn.IS_AUTO_RUN = true

    const current = observable.box(null)

    Object.defineProperty(target, method, {
      get() {
        return current.get()
      },
    })
  }
}
