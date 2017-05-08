import { observable, autorun } from 'mobx'

// subscribe-aware helpers
// @query value wrapper
function valueWrap(valueGet: Function) {
  const result = observable.box(null)
  let value = valueGet() || {}

  // already query!
  if (value.$isQuery) {
    return value
  }

  // subscribe and update
  let subscriber = null
  const finishSubscribe = () => {
    if (subscriber) {
      subscriber.complete()
    }
  }

  // this automatically re-runs the susbcription if it has observables
  const runner = autorun(() => {
    finishSubscribe()
    value = valueGet() || {}
    if (value.$) {
      // sub to values
      subscriber = value.$.subscribe(value => {
        result.set(value)
      })
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
      get: () => {
        return result.get() || null
      },
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
    delete descriptor.initializer
    descriptor.value = function(...args) {
      return valueWrap(() => initializer.call(this).apply(this, args))
    }
  } else if (value) {
    descriptor.value = function(...args) {
      return valueWrap(() => value.apply(this, args))
    }
  }

  return descriptor
}
