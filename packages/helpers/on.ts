import event from 'disposable-event'
import { Disposable, CompositeDisposable } from 'event-kit'

const isBrowser = typeof window !== 'undefined'

const RealMutationObserver =
  // @ts-ignore
  isBrowser && window.MutationObserver

const IsomorphicMutationObserver: typeof MutationObserver = isBrowser
  ? RealMutationObserver
  : class FakeMutationObserver {}

type Subject = {
  subscriptions: CompositeDisposable
}

type OnAble =
  | number
  | NodeJS.Timer
  | Disposable
  | MutationObserver
  | {
      subscribe?: Function
      emitter?: Function
      dispose?: Function
      _idleTimeout?: number
    }

// fuck electron doesnt have timers
const looksLikeTimeout = thing => !!thing._idleTimeout

// because instanceof breaks idk
const looksLikeDisposable = thing =>
  typeof thing.dispose === 'function' && !thing.subscribe && !thing.emitter

// 1. listens to a lots of things:
//    setTimeout numbers
//    MutationObservers
//    Rx.Subject / Rx.Observer
//    Emitter
//    eventListeners (addEventListener, removeEventListener)
// 2. adds it onto this.subscriptions
// 3. returns an off function
export default function on(
  subject: Subject,
  target: OnAble,
  eventName: String | Function,
  callback: Function,
) {
  if (typeof target === 'number' || looksLikeTimeout(target)) {
    const dispose = () => clearTimeout(target as NodeJS.Timer)
    subject.subscriptions.add({ dispose })
    return dispose
  }
  if (target instanceof IsomorphicMutationObserver) {
    // MutationObserver
    const dispose = () => target.disconnect()
    subject.subscriptions.add({ dispose })
    return dispose
  }
  if (target instanceof Disposable || looksLikeDisposable(target)) {
    subject.subscriptions.add(target as Disposable)
    return target
  }
  // subscribable
  if (target.subscribe) {
    if (typeof eventName !== 'function') {
      throw new Error(`Should pass in (Observable, callback) for Observables`)
    }
    const subscription = target.subscribe(eventName)
    const dispose = () => subscription.unsubscribe()
    subject.subscriptions.add({ dispose })
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
  subject.subscriptions.add(dispose)
  return dispose
}
