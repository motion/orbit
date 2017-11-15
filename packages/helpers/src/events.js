// @flow
import event from 'disposable-event'
import { CompositeDisposable } from 'sb-event-kit'

function _on(element: HTMLElement, cb: Function, bind: boolean): Function {
  if (element && element.emitter) {
    return _on.call(this, element.emitter, cb, bind)
  }
  const e = event(element, cb, bind)
  this.subscriptions.add(e)
  return e
}

const ogSetTimeout =
  typeof window !== 'undefined' ? window.setTimeout : global.setTimeout
const ogSetInterval =
  typeof window !== 'undefined' ? window.setInterval : global.setInterval
const ogRequestAnimationFrame =
  typeof window !== 'undefined' ? window.setInterval : global.setInterval

function _setTimeout(givenCallback: Function, duration: number): number {
  let subscription
  const callback = () => {
    if (subscription) subscription.dispose()
    givenCallback.call(this)
  }
  const timeoutId = ogSetTimeout(callback, duration)
  subscription = this.subscriptions.add(() => {
    clearTimeout(timeoutId)
  })
  return timeoutId
}

function _setInterval(givenCallback: Function, duration: number): number {
  const intervalId = ogSetInterval(givenCallback, duration)
  this.subscriptions.add(() => {
    clearInterval(intervalId)
  })
  return intervalId
}

function _requestAnimationFrame(
  givenCallback: Function,
  duration: number
): number {
  const id = ogRequestAnimationFrame(givenCallback, duration)
  this.subscriptions.add(() => {
    clearInterval(id)
  })
  return id
}

// adds this.subscriptions to a class at call-time
function patchSubscribers(fn) {
  return function(...args: Array<any>) {
    if (!this.subscriptions) {
      this.subscriptions = new CompositeDisposable()
      // dispose
      const oComponentWillUnmount = this.componentWillUnmount
      this.componentWillUnmount = function() {
        this.subscriptions.dispose()
        oComponentWillUnmount && oComponentWillUnmount.call(this, arguments)
      }
    }
    return fn.call(this, ...args)
  }
}

export const requestAnimationFrame = patchSubscribers(_requestAnimationFrame)
export const setTimeout = patchSubscribers(_setTimeout)
export const setInterval = patchSubscribers(_setInterval)
export const on = patchSubscribers(_on)
