import Configstore from 'configstore'
import { ensureDirSync } from 'fs-extra'
import fetch from 'node-fetch'
import path from 'path'

import { isTruthy } from './is-truthy'
import { Store } from './store'

/* The events data collection is a spooled process that
 * buffers events to a local fs based buffer
 * which then is asynchronously flushed to the server.
 * This both increases the fault tolerancy and allows collection
 * to continue even when working offline.
 */
export class EventStorage {
  verbose = false
  debugEvents = false
  disabled = false
  config = new Configstore(`orbit`, {}, { globalConfigPath: true })
  store: Store

  constructor() {
    const baseDir = path.dirname(this.config.path)

    try {
      ensureDirSync(baseDir)
    } catch (e) {
      // TODO: Log this event
    }

    this.store = new Store(baseDir)
    this.verbose = isTruthy(process.env.ORBIT_TELEMETRY_VERBOSE)
    this.debugEvents = isTruthy(process.env.ORBIT_TELEMETRY_DEBUG)
    this.disabled = isTruthy(process.env.ORBIT_TELEMETRY_DISABLED)
  }

  addEvent(event) {
    if (this.disabled) {
      return
    }

    const eventString = JSON.stringify(event)

    if (this.debugEvents || this.verbose) {
      console.error(`Captured event:`, eventString)

      if (this.debugEvents) {
        // Bail because we don't want to send debug events
        return
      }
    }

    this.store.appendToBuffer(eventString + `\n`)
  }

  async sendEvents() {
    return this.store.startFlushEvents(async eventsData => {
      const events = eventsData
        .split(`\n`)
        .filter(e => e && e.length > 2) // drop empty lines
        .map(e => JSON.parse(e))

      return this.submitEvents(events)
    })
  }

  async submitEvents(events) {
    try {
      const res = await fetch(`https://analytics.orbitjs.com/events`, {
        method: `POST`,
        headers: { 'content-type': `application/json` },
        body: JSON.stringify(events),
      })
      return res.ok
    } catch (e) {
      return false
    }
  }

  getConfig(key) {
    if (key) {
      return this.config.get(key)
    }
    return this.config.all
  }

  updateConfig(key, value) {
    return this.config.set(key, value)
  }
}
