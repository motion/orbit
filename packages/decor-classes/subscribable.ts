import { CompositeDisposable } from 'event-kit'
import { DecorPlugin } from '@mcro/decor'

export interface Subscribable {
  readonly subscriptions: CompositeDisposable
}

function subscribableDecorator(Klass: any): Subscribable {
  if (Klass.prototype.subscriptions) {
    return Klass
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
  return Klass
}

export default <DecorPlugin<Subscribable>>function subscribable() {
  return {
    name: 'subscribable',
    once: true,
    onlyClass: true,
    decorator: subscribableDecorator,
  }
}
