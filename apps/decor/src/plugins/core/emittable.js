import { Emitter, CompositeDisposable } from 'sb-event-kit'

const DEFAULT_OPTS = {
  emitterProp: 'emitter',
  emitProp: 'emit',
}

// store.emitter
export default function emittable(options = DEFAULT_OPTS) {
  const { emitterProp } = options

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
