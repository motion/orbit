// @flow
import { CompositeDisposable } from 'sb-event-kit'

declare class Subscribable {
  subscriptions: CompositeDisposable,
}

declare class Object {
  static defineProperty(any, any, any): void,
}

export default () => ({
  name: 'subscribable',
  once: true,
  onlyClass: true,
  decorator: (Klass: Class<any> | Function) => {
    if (Klass.prototype.subscriptions) {
      console.log('skip, already has subscriptions')
      return Klass
    }
    Object.defineProperty(Klass.prototype, 'subscriptions', {
      configurable: true,
      enumerable: true,
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
