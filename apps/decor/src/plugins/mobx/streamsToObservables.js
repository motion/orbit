import { Observable } from 'rxjs'
import { fromStream } from 'mobx-utils'

// auto rx => mobx
function rxToMobx(object: Object) {
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

export default options => ({
  name: 'mobx-streams-to-observables',
  mixin: {
    componentWillMount() {
      rxToMobx(this)
    },
  },
})
