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

type Watchable = {
  subscribe?: Function
  emitter?: Function
  dispose?: Function
  _idleTimeout?: number
}

type OnAble = number | NodeJS.Timer | Disposable | MutationObserver | Watchable

// fuck electron doesnt have timers
const looksLikeTimeout = thing => thing && !!thing._idleTimeout

// because instanceof breaks idk
const looksLikeDisposable = thing =>
  thing &&
  typeof thing.dispose === 'function' &&
  !thing.subscribe &&
  !thing.emitter

// 1. listens to a lots of things:
// 2. adds it onto this.subscriptions
// 3. returns an off function
export default function on(
  subject: Subject,
  target: OnAble,
  eventName: String | Function,
  callback: Function,
) {
  if (!target) {
    throw new Error('No target given')
  }
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
  // cast to Watchable because can't use NodeJS.Timer above
  target = target as Watchable
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
  return () => dispose.dispose()
}
