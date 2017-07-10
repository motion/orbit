// @flow
import { observable, isObservable, autorun } from 'mobx'
import hashsum from 'hash-sum'

const short = value =>
  (value && JSON.stringify(value).slice(0, 15) + '..') || value
const Cache = {}
const CacheListeners = {}

function execQuery(it, valueGet: Function) {
  const KEY = hashsum(it)
  // log('@query', it)
  CacheListeners[KEY] = (CacheListeners[KEY] || 0) + 1

  if (Cache[KEY]) {
    return Cache[KEY]
  }

  const result = observable.shallowBox(undefined)
  let query = valueGet()

  if (!query) {
    return query
  }

  // TODO can probably handle this here
  // const notConnected = query && query.isntConnected

  const INFO = `@query ${it.model}.${it.property}(${it.args.join(', ')}) => `

  // subscribe and update
  let subscriber = null
  const finishSubscribe = () => {
    if (subscriber && subscriber.complete) {
      subscriber.complete()
    }
  }

  function runSubscribe() {
    if (query.$) {
      finishSubscribe()
      subscriber = query.$.subscribe(value => {
        // log('SUBSCRIBE', INFO, short(value))
        if (isObservable(value)) {
          result.set(value)
        } else {
          result.set(observable.shallowBox(value))
        }
      })
    }
  }

  let isObserving = false
  function observe() {
    // log('observe', isObserving, query && query.isntConnected)
    if (isObserving) {
      return
    }
    isObserving = true
    // handle not connected yet
    if (query.isntConnected) {
      query.onConnection().then(() => {
        query = valueGet()
        runSubscribe()
      })
    } else {
      runSubscribe()
    }
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
  const id = Math.random()
  const getValue = () => {
    observe() // start observe
    return result.get() && result.get().get()
  }

  // helpers
  Object.defineProperties(response, {
    $isQuery: {
      value: true,
    },
    exec: {
      value: () => {
        return (query.exec
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
    id: {
      value: id,
    },
    query: {
      value: query,
    },
    $: {
      value: query.$,
    },
    current: {
      get: getValue,
    },
    get: {
      value: getValue,
    },
    observable: {
      value: result,
    },
    dispose: {
      value() {
        CacheListeners[KEY]--

        // delayed dispose to avoid lots of disconnect/reconnect actions on route changes
        if (CacheListeners[KEY] === 0) {
          setTimeout(() => {
            if (CacheListeners[KEY] === 0) {
              finishSubscribe()
              stopSync && stopSync()
            }
          }, 1000)
        }
      },
    },
  })

  Cache[KEY] = response

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
      this.__queryUniq = Math.random()
      const init = initializer.call(this)
      return function(...args) {
        if (!this.collection) {
          console.log('no this.collection!')
          return null
        }
        return execQuery.call(
          this,
          {
            model: this.constructor.name,
            property,
            args,
            uniq: this.__queryUniq,
          },
          () => init.apply(this, args)
        )
      }
    }
  } else if (value) {
    descriptor.value = function(...args) {
      return execQuery.call(
        this,
        { model: this.constructor.name, property, args },
        () => value.apply(this, args)
      )
    }
  }

  return descriptor
}
