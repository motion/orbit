import event from 'disposable-event'
import { CompositeDisposable, Disposable } from 'event-kit'

const isBrowser = typeof window !== 'undefined'

const RealMutationObserver =
  // @ts-ignore
  isBrowser && window.MutationObserver

const IsomorphicMutationObserver: any = isBrowser
  ? RealMutationObserver
  : class FakeMutationObserver {}

type Watchable = {
  subscribe?: Function
  emitter?: Function
  dispose?: Function
  _idleTimeout?: number
}

type Subscriber = { unsubscribe: Function }

type ElementLike = Element | HTMLElement | HTMLDivElement | Window | Document

type OnAble =
  | number
  | NodeJS.Timer
  | Disposable
  | MutationObserver
  | Watchable
  | Subscriber
  | ElementLike
  | { on: Function; emit: Function }

// fuck electron doesnt have timers
const looksLikeTimeout = thing => thing && !!thing._idleTimeout

// because instanceof breaks idk
const looksLikeDisposable = thing =>
  thing && typeof thing.dispose === 'function' && !thing.subscribe && !thing.emitter

// adds this.subscriptions to a class at call-time
function patchSubscribers(subject) {
  if (subject && !subject.subscriptions) {
    subject.subscriptions = new CompositeDisposable()
    // dispose
    const oComponentWillUnmount = subject.componentWillUnmount
    subject.componentWillUnmount = function() {
      subject.subscriptions.dispose()
      oComponentWillUnmount && oComponentWillUnmount.call(subject, arguments)
    }
  }
}

// 1. listens to a lots of things:
// 2. adds it onto this.subscriptions
// 3. returns an off function
export function on(
  subject: any,
  target: OnAble,
  eventName?: String | Function,
  callback?: Function,
) {
  if (!target) {
    throw new Error('No target given')
  }
  patchSubscribers(subject)
  // Timer
  if (typeof target === 'number' || looksLikeTimeout(target)) {
    const dispose = () => clearTimeout(target as NodeJS.Timer)
    subject.subscriptions.add({ dispose })
    return dispose
  }
  // MutationObserver
  if (target instanceof IsomorphicMutationObserver) {
    const result = target as MutationObserver
    const dispose = () => result.disconnect()
    subject.subscriptions.add({ dispose })
    return dispose
  }
  // Disposable
  if (target instanceof Disposable || looksLikeDisposable(target)) {
    const disposable = target as Disposable
    subject.subscriptions.add(disposable)
    return () => disposable.dispose()
  }
  // Observable
  target = target as Subscriber
  if (typeof target.unsubscribe === 'function') {
    // @ts-ignore
    const dispose = () => target.unsubscribe()
    subject.subscriptions.add({ dispose })
    return dispose
  }
  // cast to Watchable because can't use NodeJS.Timer above
  target = target as Watchable
  // subscribable
  if (target.subscribe) {
    if (typeof eventName !== 'function') {
      throw new Error('Should pass in (Observable, callback) for Observables')
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
  return () => dispose.dispose()
}
