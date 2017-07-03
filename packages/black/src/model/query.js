// @flow
import { observable, isObservable } from 'mobx'
import hashsum from 'hash-sum'

// TODO: instanceof RxQuery checks

// subscribe-aware helpers
// @query value wrapper
function valueWrap(it, valueGet: Function) {
  const result = observable.shallowBox(undefined)
  let query = valueGet()
  // TODO can probably handle this here
  // const notConnected = query && query.isntConnected

  // const INFO = `@query ${it.model}.${it.property}(${it.args.join(', ')}) => `

  // subscribe and update
  let subscriber = null
  const finishSubscribe = () => {
    if (subscriber && subscriber.complete) {
      subscriber.complete()
    }
  }

  // this automatically re-runs queries if the use mobx observables, magical
  if (query && query.$) {
    // sub to values
    subscriber = query.$.subscribe(value => {
      // log(INFO, '.subscribe( => ', value)
      if (isObservable(value)) {
        result.set(value)
      } else {
        result.set(observable.shallowBox(value))
      }
    })
  }

  // autosync query
  let stopSync = null

  // TODO: once rxdb #207 check with (query instanceof RxQuery)
  // TODO re-enable
  if (false && query && query.mquery && this.remoteDB) {
    const selector = query.keyCompress().selector
    const key = hashsum({ db: this.remoteDB.name, selector })
    if (!this.queryCache[key]) {
      this.queryCache[key] = true
      const syncSettings = {
        remote: this.remoteDB,
        waitForLeadership: false,
        query,
      }
      const syncer = this.collection.sync(syncSettings)
      stopSync = () => {
        delete this.queryCache[key]
        syncer.cancel()
      }
    }
  }

  const response = {}

  // helpers
  Object.defineProperties(response, {
    $isQuery: {
      value: true,
    },
    exec: {
      value: () => {
        return (query && query.exec
          ? query.exec()
          : Promise.resolve(query)).then(val => {
          // helper: queries return empty objects on null findOne(), this returns null
          if (val instanceof Object && Object.keys(val).length === 0) {
            return null
          }
          return val
        })
      },
    },
    $: {
      value: query && query.$,
    },
    current: {
      get: () => {
        // yea i know this is bad but it works for now
        return result.get() && result.get().get()
      },
    },
    observable: {
      value: result,
    },
    dispose: {
      value() {
        finishSubscribe()
        // stopAutorun()
        if (stopSync) {
          stopSync()
        }
      },
    },
  })

  return response
}

export default function query(
  parent: Class,
  property: String,
  descriptor: Object
) {
  const { initializer, value } = descriptor

  if (initializer) {
    descriptor.initializer = function() {
      const init = initializer.call(this)
      return function(...args) {
        if (!this.collection) {
          console.log('no this.collection!')
          return null
        }
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
