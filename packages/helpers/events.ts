import { CompositeDisposable } from 'event-kit'
import _on from './on'

// adds this.subscriptions to a class at call-time
function patchSubscribers(fn) {
  return function(...args: Array<any>) {
    const subject = args[0]
    if (subject && !subject.subscriptions) {
      subject.subscriptions = new CompositeDisposable()
      // dispose
      const oComponentWillUnmount = subject.componentWillUnmount
      subject.componentWillUnmount = function() {
        subject.subscriptions.dispose()
        oComponentWillUnmount && oComponentWillUnmount.call(subject, arguments)
      }
    }
    return fn.call(this, ...args)
  }
}

export const on = patchSubscribers(_on)
