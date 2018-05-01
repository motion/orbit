import { CompositeDisposable } from 'sb-event-kit'

export default () => ({
  name: 'subscribable',
  once: true,
  onlyClass: true,
  decorator: Klass => {
    if (Klass.prototype.subscriptions) {
      throw new Error(
        'skip, already has subscriptions or dispsose already defined! ${Klass.constructor.name}',
      )
    }
    Object.defineProperty(Klass.prototype, 'subscriptions', {
      configurable: true,
      enumerable: false,
      get() {
        if (!this.__subscriptions) {
          this.__subscriptions = new CompositeDisposable()
        }
        return this.__subscriptions
      },
    })
  },
})
