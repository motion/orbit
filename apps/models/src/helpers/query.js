import { observable, autorun } from 'mobx'

// subscribe-aware helpers
// @query value wrapper
function valueWrap(valueGet: Function) {
  const result = observable.shallowBox(null)
  let value = valueGet() || {}

  // subscribe and update
  let subscriber = null
  const finishSubscribe = () => {
    if (subscriber) {
      subscriber.complete()
    }
  }

  // this automatically re-runs the susbcription if it has observables
  const stopAutorun = autorun(() => {
    finishSubscribe()
    value = valueGet() || {}
    if (value.$) {
      // sub to values
      subscriber = value.$.subscribe(value => {
        result.set(observable.shallowBox(value))
      })
    }
  })

  const response = {}

  // helpers
  Object.defineProperties(response, {
    $isQuery: {
      value: true,
    },
    exec: {
      value: value.exec,
    },
    $: {
      value: value.$,
    },
    current: {
      get: () => {
        // ok, i know, i know, you're looking at me with that fuggin look
        // look. this is real strange. but you try returning a single Document.get()
        // and see if the double wrap isn't the only way you get it working.
        // i dare you
        return result.get() && result.get().get()
      },
    },
    observable: {
      value: result,
    },
    dispose: {
      value() {
        finishSubscribe()
        stopAutorun()
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
        return valueWrap(() => init.apply(this, args))
      }
    }
  } else if (value) {
    descriptor.value = function(...args) {
      return valueWrap(() => value.apply(this, args))
    }
  }

  return descriptor
}
