import event from 'disposable-event'
import { Disposable } from 'event-kit'

export default function on(...args): Disposable {
  console.log('calling', this, args)
  // allows calling with just on('eventName', callback) and using this
  if (args.length === 2) {
    // duck type observables for now
    if (args[0] && args[0].subscribe) {
      return onSomething.call(this, ...args)
    }
    if (typeof args[0] !== 'string') {
      throw new Error(`String required as first arg when only two args passed`)
    }
    if (typeof args[1] !== 'function') {
      throw new Error(
        `Function callback required as second arg when only two args passed`,
      )
    }
    return onSomething.call(this, this, ...args)
  }
  return onSomething.call(this, ...args)
}

type OnAble = {
  subscribe?: Function
  emitter?: Function
}

// listens to a three types of things:
//    Rx.Subject / Rx.Observer
//    Emitter
//    eventListeners (addEventListener, removeEventListener)
// returns an off function
function onSomething(
  target: OnAble,
  eventName: String | Function,
  callback: Function,
) {
  let disposable
  if (target.subscribe) {
    if (typeof eventName !== 'function') {
      throw new Error(`Should pass in (Observable, callback) for Observables`)
    }
    const subscription = target.subscribe(eventName)
    disposable = () => subscription.unsubscribe()
  } else if (target && target.emitter) {
    return on.call(this, target.emitter, eventName, callback)
  } else {
    disposable = event(target, eventName, callback)
  }
  this.subscriptions.add(disposable)
  // return just the function that unsubscribes
  return disposable.dispose ? disposable.dispose.bind(disposable) : disposable
}
