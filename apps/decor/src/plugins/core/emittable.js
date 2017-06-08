import { Emitter, CompositeDisposable } from 'sb-event-kit'

// store.emitter
export default function emittable(options) {
  const emitterProp = options.emitterProp || 'emitter'
  const emitProp = options.emitProp || 'emit'

  return {
    decorator: Klass => {
      if (!Klass.prototype) {
        return Klass
      }

      Object.defineProperty(Klass.prototype, emitterProp, {
        get() {
          const KEY = `__${emitterProp}`
          if (!this[emitterProp]) {
            this[KEY] = new Emitter()
            // auto add to susbcriptions
            if (this.subscriptions) {
              this.subscriptions.add(this[KEY])
            }
          }
          return this[KEY]
        },
      })

      // bind emit directly
      Object.defineProperty(Klass.prototype, emitProp, {
        get() {
          console.log('getting', this[emitterProp])
          return this[emitterProp].emit
        },
      })
    },
  }
}
