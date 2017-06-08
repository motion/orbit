import { CompositeDisposable } from 'sb-event-kit'

export default options => ({
  name: 'subscribable',
  decorator: Klass => {
    if (!Klass.prototype) {
      return Klass
    }

    Object.defineProperty(Klass.prototype, 'subscriptions', {
      get() {
        if (!this.__subscriptions) {
          this.__subscriptions = new CompositeDisposable()
        }
        return this.__subscriptions
      },
    })
  },
  mixin: {
    componentWillUnmount() {
      this.subscriptions.dispose()
    },
  },
})
