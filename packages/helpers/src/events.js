// @flow
import { CompositeDisposable } from 'sb-event-kit'
import global from 'global'
import _on from './on'
import _requestAnimationFrame from './requestAnimationFrame'

const ogSetTimeout = global.setTimeout
const ogSetInterval = global.setInterval

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
