import { execSync } from 'child_process'
import ci from 'ci-info'
import { createHash } from 'crypto'
import isDocker from 'is-docker'
import os from 'os'
import { basename, join, sep } from 'path'
import uuid from 'uuid/v1'

import { sanitizeErrors } from './error-helpers'
import { EventStorage } from './event-storage'

export class Telemetry {
  installedOrbitVersion: string
  orbitCliVersion: string
  machineId: string

  store = new EventStorage()
  debouncer = {}
  metadataCache = {}
  defaultTags = {}
  osInfo // lazy
  trackingEnabled // lazy
  componentVersion: any
  sessionId = uuid()
  constructor() {
    try {
      this.componentVersion = require(`../package.json`).version
      this.installedOrbitVersion = this.getOrbitVersion()
      this.orbitCliVersion = this.getOrbitCliVersion()
    } catch (e) {
      // ignore
    }
  }

  getOrbitVersion() {
    const packageInfo = require(join(process.cwd(), `node_modules`, `orbit`, `package.json`))
    try {
      return packageInfo.version
    } catch (e) {
      // ignore
    }
    return undefined
  }

  getOrbitCliVersion() {
    try {
      const jsonfile = join(
        require
          .resolve(`cli`) // Resolve where current cli would be loaded from.
          .split(sep)
          .slice(0, -2) // drop lib/index.js
          .join(sep),
        `package.json`,
      )
      const { version } = require(jsonfile).version
      return version
    } catch (e) {
      // ignore
    }
    return undefined
  }
  captureEvent(type = ``, tags = {}) {
    if (!this.isTrackingEnabled()) {
      return
    }
    let baseEventType = `CLI_COMMAND`
    if (Array.isArray(type)) {
      type = type.length > 2 ? type[2].toUpperCase() : ``
      baseEventType = `CLI_RAW_COMMAND`
    }

    const decoration = this.metadataCache[type]
    delete this.metadataCache[type]
    const eventType = `${baseEventType}_${type}`
    this.buildAndStoreEvent(eventType, Object.assign(tags, decoration))
  }

  captureError(type, tags: any = {}) {
    if (!this.isTrackingEnabled()) {
      return
    }
    const decoration = this.metadataCache[type]
    delete this.metadataCache[type]
    const eventType = `CLI_ERROR_${type}`

    if (tags.error) {
      // `error` ought to have been `errors` but is `error` in the database
      tags.error = sanitizeErrors(tags.error)
    }

    this.buildAndStoreEvent(eventType, Object.assign(tags, decoration))
  }

  captureBuildError(type, tags: any = {}) {
    if (!this.isTrackingEnabled()) {
      return
    }
    const decoration = this.metadataCache[type]
    delete this.metadataCache[type]
    const eventType = `BUILD_ERROR_${type}`

    if (tags.error) {
      // `error` ought to have been `errors` but is `error` in the database
      tags.error = sanitizeErrors(tags.error)
    }

    this.buildAndStoreEvent(eventType, Object.assign(tags, decoration))
  }

  buildAndStoreEvent(eventType, tags) {
    const event = {
      installedOrbitVersion: this.installedOrbitVersion,
      orbitCliVersion: this.orbitCliVersion,
      ...this.defaultTags,
      ...tags, // The schema must include these
      eventType,
      sessionId: this.sessionId,
      time: new Date(),
      machineId: this.getMachineId(),
      repositoryId: this.getRepoId(),
      componentId: `cli`,
      osInformation: this.getOsInfo(),
      componentVersion: this.componentVersion,
    }
    this.store.addEvent(event)
  }

  getMachineId() {
    // Cache the result
    if (this.machineId) {
      return this.machineId
    }
    let machineId = this.store.getConfig(`telemetry.machineId`)
    if (!machineId) {
      machineId = uuid()
      this.store.updateConfig(`telemetry.machineId`, machineId)
    }
    this.machineId = machineId
    return machineId
  }

  isTrackingEnabled() {
    // Cache the result
    if (this.trackingEnabled !== undefined) {
      return this.trackingEnabled
    }
    let enabled = this.store.getConfig(`telemetry.enabled`)
    if (enabled === undefined || enabled === null) {
      if (!ci.isCI) {
        // showAnalyticsNotification()
      }
      enabled = true
      this.store.updateConfig(`telemetry.enabled`, enabled)
    }
    this.trackingEnabled = enabled
    return enabled
  }

  getRepoId() {
    // we may live multiple levels in git repo
    let prefix = `pwd:`
    let repo = basename(process.cwd())
    try {
      const originBuffer = execSync(`git config --local --get remote.origin.url`, {
        timeout: 1000,
        stdio: `pipe`,
      })
      repo = String(originBuffer).trim()
      prefix = `git:`
    } catch (e) {
      // ignore
    }
    const hash = createHash(`sha256`)
    hash.update(repo)
    return prefix + hash.digest(`hex`)
  }

  getOsInfo() {
    if (this.osInfo) {
      return this.osInfo
    }
    const cpus = os.cpus()
    const osInfo = {
      nodeVersion: process.version,
      platform: os.platform(),
      release: os.release(),
      cpus: cpus && cpus.length > 0 && cpus[0].model,
      arch: os.arch(),
      ci: ci.isCI,
      ciName: (ci.isCI && ci.name) || undefined,
      docker: isDocker(),
    }
    this.osInfo = osInfo
    return osInfo
  }

  trackActivity(source) {
    if (!this.isTrackingEnabled()) {
      return
    }
    // debounce by sending only the first event whithin a rolling window
    const now = Date.now()
    const last = this.debouncer[source] || 0
    const debounceTime = 5 * 1000 // 5 sec

    if (now - last > debounceTime) {
      this.captureEvent(source)
    }
    this.debouncer[source] = now
  }

  decorateNextEvent(event, obj) {
    const cached = this.metadataCache[event] || {}
    this.metadataCache[event] = Object.assign(cached, obj)
  }

  decorateAll(tags) {
    this.defaultTags = Object.assign(this.defaultTags, tags)
  }

  setTelemetryEnabled(enabled) {
    this.trackingEnabled = enabled
    this.store.updateConfig(`telemetry.enabled`, enabled)
  }

  async sendEvents() {
    if (!this.isTrackingEnabled()) {
      return Promise.resolve()
    }
    return this.store.sendEvents()
  }
}
