// @flow
import { Emitter } from 'sb-event-kit'

declare class Emittable {
  emitter: Emitter,
  emit(name: string, data: any): void,
}

// store.emitter
export default function emittable(options: Object) {
  const emitterProp = options.emitterProp || 'emitter'
  const emitProp = options.emitProp || 'emit'

  return {
    name: 'emittable',
    once: true,
    onlyClass: true,
    decorator: (Klass: Class<any> | Function) => {
      Object.defineProperty(Klass.prototype, emitterProp, {
        get() {
          const KEY = `__${emitterProp}`

          if (!this[KEY] || this[KEY].disposed) {
            // bugfix: auto remake emitters
            const emitter = new Emitter()
            this[KEY] = emitter

            // bind
            emitter.emit = emitter.emit.bind(emitter)

            // auto add to susbcriptions
            if (this.subscriptions) {
              this.subscriptions.add(emitter)
            }
          }
          return this[KEY]
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
