// @flow
import { observable, isObservable, autorun } from 'mobx'
import hashsum from 'hash-sum'

const short = value => (value && JSON.stringify(value).slice(0, 20)) || value
const Cache = {}
const CacheListeners = {}

function execQuery(it, valueGet: Function) {
  const KEY = hashsum(it)
  CacheListeners[KEY] = (CacheListeners[KEY] || 0) + 1

  if (Cache[KEY]) {
    return Cache[KEY]
  }

  const result = observable.shallowBox(undefined)
  let query = valueGet()

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
    if (query && query.$) {
      finishSubscribe()
      subscriber = query.$.subscribe(value => {
        log(INFO, '.subscribe() =>', short(value))
        if (isObservable(value)) {
          result.set(value)
        } else {
          result.set(observable.shallowBox(value))
        }
      })
    }
  }

  // handle not connected yet
  if (query && query.isntConnected) {
    log('not connected yet')
    query.onConnection().then(() => {
      console.log('ok not lets re-run')
      query = valueGet()
      runSubscribe()
    })
  } else {
    runSubscribe()
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
    id: {
      value: id,
    },
    query: {
      value: query,
    },
    $: {
      value: query && query.$,
    },
    current: {
      get: () => {
        return result.get() && result.get().get()
      },
    },
    observable: {
      value: result,
    },
    dispose: {
      value() {
        CacheListeners[KEY]--
        console.log('dispose? listeners:', CacheListeners[KEY])

        // delayed dispose to avoid lots of disconnect/reconnect actions on route changes
        if (CacheListeners[KEY] === 0) {
          setTimeout(() => {
            if (CacheListeners[KEY] === 0) {
              log('actually disposing')
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
