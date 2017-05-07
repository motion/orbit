import BaseModel from './baseModel'

// exports
import { observable, autorun } from 'mobx'

// subscribe-aware helpers
// @query value wrapper
function valueWrap(valueGet: Function) {
  const obsrv = observable.box(null)
  let value = valueGet() || {}

  // already query!
  if (value.$isQuery) {
    return value
  }

  // subscribe and update
  let subscriber = null
  const finishSubscribe = () => subscriber && subscriber.complete()
  const runner = autorun(() => {
    finishSubscribe()
    value = valueGet() || {}
    if (value.$) {
      // sub to values
      subscriber = value.$.subscribe(value => obsrv.set(value))
    }
  })

  // helpers
  Object.defineProperties(value, {
    $isQuery: {
      value: true,
    },
    promise: {
      get: () => value.exec(),
    },
    current: {
      get: () => obsrv.get() || null,
    },
    dispose: {
      value() {
        finishSubscribe()
        runner()
      },
    },
  })

  return value
}

export function query(parent, property, descriptor) {
  const { initializer, value } = descriptor

  if (initializer) {
    descriptor.initializer = function() {
      return function(...args) {
        return valueWrap(() => initializer.call(this).apply(this, args))
      }
    }
  } else if (value) {
    descriptor.value = function(...args) {
      return valueWrap(() => value.apply(this, args))
    }
  }

  return descriptor
}

export { bool, int, str, object, array } from 'kontur'

export class Model extends BaseModel {
  constructor() {
    super({
      defaultSchema: {
        primaryPath: '_id',
        version: 0,
        disableKeyCompression: true,
      },
    })
  }
}
