// @flow
import event from 'disposable-event'
import { Disposable, CompositeDisposable } from 'sb-event-kit'
import global from 'global'

function _on(...args): Disposable {
  // allows calling with just on('eventName', callback) and using this
  if (args.length === 2) {
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

function onSomething(target: Object, eventName: String, callback: Function) {
  if (target && target.emitter) {
    return _on.call(this, target.emitter, eventName, callback)
  }
  const e = event(target, eventName, callback)
  this.subscriptions.add(e)
  return e
}

const ogSetTimeout = global.setTimeout
const ogSetInterval = global.setInterval
const ogRequestAnimationFrame = global.setInterval

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
