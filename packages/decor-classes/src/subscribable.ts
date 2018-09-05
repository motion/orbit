import { CompositeDisposable } from 'event-kit'
import { DecorPlugin } from '@mcro/decor'

export interface Subscribable {
  readonly subscriptions: CompositeDisposable
}

function subscribableDecorator(Klass: any): Subscribable {
  if (!Klass.prototype || Klass.prototype.subscriptions) {
    return Klass
  }
  let val
  Object.defineProperty(Klass.prototype, 'subscriptions', {
    configurable: true,
    enumerable: false,
    get() {
      if (typeof val !== 'undefined') {
        return val
      }
      if (!this.__subscriptions) {
        this.__subscriptions = new CompositeDisposable()
      }
      return this.__subscriptions
    },
    set(newVal) {
      val = newVal
    },
  })
  return Klass
}

export const subscribable = <DecorPlugin<Subscribable>>function subscribable() {
  return {
    name: 'subscribable',
    once: true,
    onlyClass: true,
    decorator: subscribableDecorator,
  }
}
