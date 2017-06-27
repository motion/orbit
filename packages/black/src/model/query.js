// @flow
// import { RxQuery } from 'rxdb'
import { observable, autorun } from 'mobx'
import debug from 'debug'
import hashsum from 'hash-sum'

const out = debug('query')

// TODO: instanceof RxQuery checks

// subscribe-aware helpers
// @query value wrapper
function valueWrap(info, valueGet: Function) {
  const result = observable.shallowBox(undefined)
  let query = valueGet() || {}

  out('query', info.model, info.property, info.args, query.mquery, query)

  // subscribe and update
  let subscriber = null
  const finishSubscribe = () => {
    if (subscriber && subscriber.complete) {
      subscriber.complete()
    } else {
      console.error('subscriber', subscriber)
    }
  }

  // this automatically re-runs the susbcription if it has observables
  const stopAutorun = autorun(() => {
    finishSubscribe()
    query = valueGet() || {}
    if (query.$) {
      // sub to values
      subscriber = query.$.subscribe(value => {
        result.set(observable.shallowBox(value))
      })
    }
  })

  // autosync query
  let stopSync = null

  // TODO: once rxdb #207 check with (query instanceof RxQuery)
  if (query && query.mquery && this.remoteDB) {
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
      value: query.$,
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
        console.log('disposing', info)
        finishSubscribe()
        stopAutorun()
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
