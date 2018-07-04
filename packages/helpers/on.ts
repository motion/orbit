import event from 'disposable-event'
import { Disposable } from 'event-kit'

// @ts-ignore
const MutationObserver =
  typeof window !== 'undefined'
    ? window.MutationObserver
    : class FakeMutationObserver {}

export default function on(...args): Disposable {
  // this allows custom `this` binding
  // instanceof CompositeDisposable not working...
  if (typeof this === 'undefined') {
    const [subject, object, eventName, eventCb] = args
    return onSomething.call(subject, object, eventName, eventCb)
  }
  // allows calling with just on('eventName', callback) and using this
  if (args.length === 2) {
    // duck type observables for now
    if ((args[0] && args[0].subscribe) || args[0] instanceof MutationObserver) {
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

type OnAble =
  | MutationObserver
  | {
      subscribe?: Function
      emitter?: Function
    }

// 1. listens to a lots of things:
//    MutationObserver
//    Rx.Subject / Rx.Observer
//    Emitter
//    eventListeners (addEventListener, removeEventListener)
// 2. adds it onto this.subscriptions
// 3. returns an off function
function onSomething(
  target: OnAble,
  eventName: String | Function,
  callback: Function,
) {
  // MutationObserver
  if (target instanceof MutationObserver) {
    const dispose = () => target.disconnect()
    this.subscriptions.add({ dispose })
    return dispose
  }
  // subscribable
  if (target.subscribe) {
    if (typeof eventName !== 'function') {
      throw new Error(`Should pass in (Observable, callback) for Observables`)
    }
    const subscription = target.subscribe(eventName)
    const dispose = () => subscription.unsubscribe()
    this.subscriptions.add({ dispose })
    return dispose
  }
  let dispose: Disposable
  if (target && target.emitter) {
    // emitter
    dispose = event(target.emitter, eventName, callback)
  } else {
    // addEventListener
    dispose = event(target, eventName, callback)
  }
  this.subscriptions.add(dispose)
  return dispose
}
