import { Emitter, CompositeDisposable } from 'sb-event-kit'

// store.emitter
export default function emittable(options) {
  const emitterProp = options.emitterProp || 'emitter'
  const emitProp = options.emitProp || 'emit'

  return {
    decorator: Klass => {
      Object.defineProperty(Klass.prototype, emitterProp, {
        get() {
          if (!this[emitterProp]) {
            this[emitterProp] = new Emitter()
            // auto add to susbcriptions
            if (this.subscriptions) {
              this.subscriptions.add(this[emitterProp])
            }
          }
          return this[emitterProp]
        },
      })

      // bind emit directly
      Object.defineProperty(Klass.prototype, emitProp, {
        get() {
          return this[emitterProp].emit
        },
      })
    },
  }
}
