// @flow
import { Observable } from 'rxjs'
import { fromStream } from 'mobx-utils'

// auto rx => mobx
export default function(object: Object) {
  Object.keys(object).forEach(key => {
    if (object[key] instanceof Observable) {
      const stream = object[key]
      object[`${key}__stream`] = stream
      const observable = fromStream(stream)
      object.subscriptions.add(observable)
      Object.defineProperty(object, key, {
        get() {
          return observable.current
        },
      })
    }
  })
}
