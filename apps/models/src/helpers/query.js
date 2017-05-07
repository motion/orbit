import { observable, autorun } from 'mobx'

const logger = (name, on) => (...args) => on && console.log(...args)
const log = logger('@query', true)

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
  const finishSubscribe = () => {
    log('finishSubscribe', !!subscriber)
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
      log('subscribe')
      subscriber = value.$.subscribe(value => {
        obsrv.set(value)
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
        return obsrv.get() || null
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
    descriptor.initializer = function() {
      return function(...args) {
        log(parent && parent.constructor.name, property)
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
