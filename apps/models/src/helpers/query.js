import { observable, autorun } from 'mobx'
import debug from 'debug'

const out = debug('query')

// subscribe-aware helpers
// @query value wrapper
function valueWrap(info, valueGet: Function) {
  const result = observable.shallowBox(undefined)
  let value = valueGet() || {}

  out('query', info.model, info.property, info.args, value)

  // subscribe and update
  let subscriber = null
  const finishSubscribe = () => subscriber && subscriber.complete()

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

  // sync!
  let pull

  if (value && value.mquery) {
    const remoteDB = this.remoteDb
    const localDB = this.pouch.name
    const selector = { ...value.mquery._conditions }

    // need to delete id or else findAll queries dont sync
    if (!selector._id || !Object.keys(selector._id).length) {
      delete selector._id
    }

    pull = PouchDB.replicate(remoteDB, localDB, {
      selector,
      // live: true,
    })
  }

  const response = {}

  // helpers
  Object.defineProperties(response, {
    $isQuery: {
      value: true,
    },
    exec: {
      value: () => {
        return (value && value.exec
          ? value.exec()
          : Promise.resolve(value)).then(val => {
          // helper: queries return empty objects on null findOne(), this returns null
          if (val instanceof Object && Object.keys(val).length === 0) {
            return null
          }
          return val
        })
      },
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
        out('disposing', info)
        finishSubscribe()
        stopAutorun()
        pull && pull.cancel()
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
        return valueWrap.call(
          this,
          { model: this.constructor.name, property, args },
          () => init.apply(this, args)
        )
      }
    }
  } else if (value) {
    descriptor.value = function(...args) {
      return valueWrap.call(
        this,
        { model: this.constructor.name, property, args },
        () => value.apply(this, args)
      )
    }
  }

  return descriptor
}
