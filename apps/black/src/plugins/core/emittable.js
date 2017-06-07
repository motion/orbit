import { Emitter, CompositeDisposable } from 'sb-event-kit'

const DEFAULT_OPTS = {
  property: '_emitter',
}

// store.emitter
export default function emittable(options = DEFAULT_OPTS) {
  return {
    decorator: Klass => {
      Object.defineProperty(Klass.prototype, 'emitter', {
        get() {
          if (!this[options.property]) {
            this[options.property] = new Emitter()
          }
          return this[options.property]
        },
      })
    },
  }
}
