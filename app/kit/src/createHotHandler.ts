import { Logger } from '@o/logger'

import { EventSourceManager } from './EventSourceManager'

const log = new Logger('createHotHandler')

// singletons
let source: EventSourceManager
const hotHandlers = new Set<HotHandler>()

// for debugging
if (typeof window !== 'undefined') {
  window['__orbit_hot'] = {
    source,
    hotHandlers,
  }
}

type HotHandlerProps = {
  name: string
  getHash: Function
  module: any
  actions?: any
  reload?: boolean
  warn?: boolean
  log?: boolean
}

export function createHotHandler(props: HotHandlerProps) {
  log.verbose(`createHotHandler`, props)
  // singleton
  source = source || new EventSourceManager('/__webpack_hmr')
  const handler = new HotHandler(props)
  hotHandlers.add(handler)
  return handler
}

export function getHotHandlers() {
  return hotHandlers
}

export function removeHotHandler(name: string) {
  log.verbose(`removeHotHandler ${name}`)
  hotHandlers.forEach(handler => {
    if (handler.props.name === name) {
      handler.dispose()
      hotHandlers.delete(handler)
    }
  })
}

export function removeAllHotHandlers() {
  log.verbose(`removeAllHotHandlers`)
  hotHandlers.clear()
  source.close()
}

class HotHandler {
  props: HotHandlerProps
  source = source

  private lastHash = ''
  private failureStatuses = { abort: 1, fail: 1 }
  private applyOptions = {
    ignoreUnaccepted: true,
    ignoreDeclined: true,
    ignoreErrored: true,
    onUnaccepted: data => {
      console.warn('Ignored an update to unaccepted module ' + data.chain.join(' -> '), data.chain)
    },
    onDeclined: data => {
      console.warn('Ignored an update to declined module ' + data.chain.join(' -> '), data.chain)
    },
    onErrored: data => {
      console.error(data.error)
      console.warn(
        'Ignored an error while updating module ' + data.moduleId + ' (' + data.type + ')',
      )
    },
  }

  get module() {
    return this.props.module
  }

  constructor(props: HotHandlerProps) {
    this.props = props
    if (!this.module.hot) {
      throw new Error('[HMR] Hot Module Replacement is disabled.')
    }
    // accept this (this should be created only at root)
    this.module.hot.accept()

    this.source.addMessageListener(this.handleMessage)
    window.addEventListener('beforeunload', this.dispose)
  }

  dispose = () => {
    this.source.removeListener(this.handleMessage)
  }

  private handleMessage = event => {
    if (event.data == '\uD83D\uDC93') return
    try {
      const msg = JSON.parse(event.data)
      this.processMessage(msg)
      if (this.props.actions) {
        if (this.props.actions[msg.action]) {
          this.props.actions[msg.action](msg)
        }
      }
    } catch (ex) {
      console.warn('Invalid HMR message: ' + event.data + '\n' + ex)
    }
  }

  private processMessage(obj) {
    if (obj.name !== this.props.name) {
      return
    }
    const name = obj.name ? `'${obj.name}' ` : ''
    switch (obj.action) {
      case 'building':
        // console.log('[HMR] bundle ' + (obj.name ? "'" + obj.name + "' " : '') + 'rebuilding')
        break
      case 'built':
        console.log(`[HMR] rebuilt ${name}in ${obj.time}ms`)
      // fall through
      case 'sync':
        var applyUpdate = true
        if (obj.errors.length > 0) {
          // if (reporter) reporter.problems('errors', obj)
          applyUpdate = false
        } else if (obj.warnings.length > 0) {
          // console.warn(obj.warnings)
        } else {
          // if (reporter) {
          //   reporter.cleanProblemsCache()
          //   reporter.success()
          // }
        }
        if (applyUpdate) {
          if (!this.upToDate(obj.hash) && this.module.hot.status() == 'idle') {
            if (this.props.log) console.log('[HMR] Checking for updates on the server...')
            this.check(obj.modules)
          }
        }
        break
    }
  }

  private upToDate(hash?) {
    if (hash) {
      this.lastHash = hash
    }
    return this.lastHash == this.props.getHash()
  }

  /** The main logic for updating javascript modules */
  private async check(moduleMap) {
    try {
      // first check
      const updatedModules = await this.module.hot.check(false)
      if (!updatedModules) {
        if (this.props.warn) console.warn('[HMR] Cannot find update, full reload needed')
        this.performReload()
        return null
      }
      // then apply
      const renewedModules = this.module.hot.apply(this.applyOptions)
      if (!this.upToDate()) {
        this.check(moduleMap)
      }
      this.logUpdates(moduleMap, updatedModules, renewedModules)
      // render after hmr
      window['rerender'](false)
    } catch (err) {
      return this.handleError(err)
    }
  }

  private handleError(err: Error) {
    if (this.module.hot.status() in this.failureStatuses) {
      if (this.props.warn) {
        console.warn('[HMR] Cannot check for update, full reload needed', err.message, err.stack)
      }
      this.performReload()
      return
    }
    if (this.props.warn) {
      console.warn('[HMR] Update check failed: ', err.message, err.stack)
    }
  }

  private performReload() {
    if (this.props.reload) {
      // window.location.reload()
    }
  }

  private logUpdates(moduleMap, updatedModules, renewedModules) {
    const unacceptedModules = updatedModules.filter(moduleId => {
      return renewedModules && renewedModules.indexOf(moduleId) < 0
    })
    if (unacceptedModules.length > 0) {
      if (this.props.warn) {
        console.warn("[HMR] The following modules couldn't be hot updated: (Full reload needed)")
        unacceptedModules.forEach(function(moduleId) {
          console.warn('[HMR]  - ' + (moduleMap[moduleId] || moduleId))
        })
      }
      this.performReload()
      return
    }
    if (this.props.log) {
      if (!renewedModules || renewedModules.length === 0) {
        console.debug('[HMR] Nothing hot updated.')
      } else {
        console.debug('[HMR] Updated modules:')
        renewedModules.forEach(moduleId => {
          console.debug('[HMR]  - ' + (moduleMap[moduleId] || moduleId))
        })
      }
      if (this.upToDate()) {
        console.debug('[HMR] App is up to date.')
      }
    }
  }
}
