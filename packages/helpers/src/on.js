// @flow
import event from 'disposable-event'
import { Disposable } from 'sb-event-kit'
import { Observable } from 'rxjs'

export default function on(...args): Disposable {
  // allows calling with just on('eventName', callback) and using this
  if (args.length === 2) {
    if (args[0] instanceof Observable) {
      return onSomething.call(this, ...args)
    }
    if (typeof args[0] !== 'string') {
      throw new Error(`String required as first arg when only two args passed`)
    }
    if (typeof args[1] !== 'function') {
      throw new Error(
        `Function callback required as second arg when only two args passed`
      )
    }
    return onSomething.call(this, this, ...args)
  }
  return onSomething.call(this, ...args)
}

function onSomething(
  target: Object,
  eventName: String | Function,
  callback: Function
) {
  if (target instanceof Observable) {
    if (typeof eventName !== 'function') {
      throw new Error(`Should pass in (Observable, callback) for Observables`)
    }
    const subscription = target.subscribe(eventName)
    this.subscriptions.add(() => subscription.unsubscribe())
    return subscription
  }
  if (target && target.emitter) {
    return on.call(this, target.emitter, eventName, callback)
  }
  const e = event(target, eventName, callback)
  this.subscriptions.add(e)
  return e
}
