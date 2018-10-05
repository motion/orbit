import { track } from '@mcro/stores'
import { reaction } from 'mobx'

class TrackSingleton {
  eventLog = []

  constructor() {
    // send events in 10 minute intervals
    setInterval(() => {
      if (!this.eventLog.length) {
        return
      }
      for (const { name, details } of this.eventLog) {
        track.recordEvent(name, details)
      }
      this.eventLog = []
    }, 1000 * 10)
  }

  event(name: string, details: Object) {
    console.log('tracking....', name, details)
    this.eventLog.push({ name, details })
  }
}

// global singleton

export const Track = new TrackSingleton()

// allows easy observe of stores to track property changes for analytics
export const autoTrack = (store, properties) => {
  const disposers = []

  for (const prop of properties) {
    const dispose = reaction(
      () => store[prop],
      val => {
        Track.event(store.constructor.name, { prop, val })
      },
    )
    disposers.push(dispose)
  }

  return {
    unsubscribe() {
      for (const disposer of disposers) {
        disposer()
      }
    },
  }
}
