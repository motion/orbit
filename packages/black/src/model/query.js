// @flow
import { observable, isObservable, autorun } from 'mobx'
import hashsum from 'hash-sum'

const Cache = {}

// TODO: instanceof RxQuery checks

// subscribe-aware helpers
// @query value wrapper
function valueWrap(it, valueGet: Function) {
  const KEY = hashsum(it)
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
        log(
          INFO,
          '.subscribe( => ',
          (value && JSON.stringify(value).slice(0, 120)) || value
        )
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
  log(INFO, '>>>>> id >>>>', id)

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
        // finishSubscribe()
        // if (stopSync) {
        //   stopSync()
        // }
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
        return valueWrap.call(
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
      return valueWrap.call(
        this,
        { model: this.constructor.name, property, args },
        () => value.apply(this, args)
      )
    }
  }

  return descriptor
}
