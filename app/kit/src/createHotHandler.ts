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
    switch (obj.action) {
      case 'building':
        // console.log('[HMR] bundle ' + (obj.name ? "'" + obj.name + "' " : '') + 'rebuilding')
        break
      case 'built':
        console.log(
          '[HMR] rebuilt ' + (obj.name ? "'" + obj.name + "' " : '') + ' in ' + obj.time + 'ms',
        )

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
          this.processUpdate(obj.hash, obj.modules, { reload: true })
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

  private async processUpdate(hash, moduleMap, options) {
    if (!this.upToDate(hash) && this.module.hot.status() == 'idle') {
      if (options.log) console.log('[HMR] Checking for updates on the server...')
      this.check(moduleMap)
    }
  }

  private check(moduleMap) {
    const cb = (err, updatedModules) => {
      if (err) {
        return this.handleError(err)
      }

      if (!updatedModules) {
        if (this.props.warn) {
          console.warn('[HMR] Cannot find update (Full reload needed)')
        }
        this.performReload()
        return null
      }

      const applyCallback = (applyErr, renewedModules) => {
        if (applyErr) {
          return this.handleError(applyErr)
        }
        if (!this.upToDate()) {
          this.check(moduleMap)
        }
        this.logUpdates(moduleMap, updatedModules, renewedModules)
      }

      var applyResult = this.module.hot.apply(this.applyOptions, applyCallback) as any
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules)
          // render after hmr
          window['rerender'](false)
        })
        applyResult.catch(applyCallback)
      }
    }

    const result = this.module.hot.check(false, cb) as any
    // webpack 2 promise
    if (result && result.then) {
      result.then(function(updatedModules) {
        cb(null, updatedModules)
      })
      result.catch(cb)
    }
  }

  private handleError(err) {
    if (this.module.hot.status() in this.failureStatuses) {
      if (this.props.warn) {
        console.warn('[HMR] Cannot check for update (Full reload needed)')
        console.warn('[HMR] ' + (err.stack || err.message))
      }
      this.performReload()
      return
    }
    if (this.props.warn) {
      console.warn('[HMR] Update check failed: ' + (err.stack || err.message))
    }
  }

  private performReload() {
    if (this.props.reload) {
      if (this.props.warn) {
        console.warn('[HMR] Reloading page')
      }
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
