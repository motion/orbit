import { CompositeDisposable } from 'event-kit'

export interface Subscribable {
  readonly subscriptions: CompositeDisposable
}

function subscribableDecorator(Klass: any): Subscribable {
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
  return Klass
}

export default function subscribable() {
  return {
    name: 'subscribable',
    once: true,
    onlyClass: true,
    decorator: subscribableDecorator,
  }
}
