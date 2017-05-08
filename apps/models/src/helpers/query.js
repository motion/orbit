import { observable, autorun } from 'mobx'

// subscribe-aware helpers
// @query value wrapper
function valueWrap(info, valueGet: Function) {
  const result = observable.box(null)
  let value = valueGet() || {}

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

  const response = {}

  // helpers
  Object.defineProperties(response, {
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

  return response
}

export function query(parent, property, descriptor) {
  const { initializer, value } = descriptor

  if (initializer) {
    descriptor.initializer = function() {
      const init = initializer.call(this)
      return function(...args) {
        return valueWrap(property, () => init.apply(this, args))
      }
    }
  } else if (value) {
    descriptor.value = function(...args) {
      return valueWrap(property, () => value.apply(this, args))
    }
  }

  return descriptor
}
