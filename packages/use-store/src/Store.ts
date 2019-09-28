import { CompositeDisposable } from 'event-kit'

export interface ReactiveStore<A extends Object> {
  props?: A
  dispose(): void
}

/**
 * Trying to move to a extends Store style instead of decorator
 *
 * For a few reasons:
 *
 *   1. Works in strictNullChecks with props so we can turn on strict mode
 *   2. No need for decoration anymore
 */

export class Store<Props extends any> implements ReactiveStore<Props> {
  props: Props
  subscriptions = new CompositeDisposable()

  constructor(props: Props) {
    this.props = props

    // The problem comes here
    // we don't have access to the parent class properties set like Test { x = 0 }
    // so we have to do something like this: setImmediate and then dos omething
    // but then we can't really decorate this as automagic.
    // what we could do is return a proxy, and have it listen for "set", and then
    // intercept that and return a reactive value instead
    // this would be pretty different from how its done now in automagical so
    // we should re-implement it here instead of trying to merge the two together
    setTimeout(() => this.setupAutomagical(), 0)

    return this
  }

  setupAutomagical() {
    const proto = Object.getPrototypeOf(this)
    console.log(Object.keys(this), Object.getOwnPropertyDescriptors(this))
    console.log(Object.keys(proto), Object.getOwnPropertyDescriptors(proto))
  }

  dispose() {
    this.subscriptions.dispose()
  }
}
