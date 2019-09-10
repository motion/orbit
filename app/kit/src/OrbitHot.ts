import { Logger } from '@o/logger'

import { EventSourceManager } from './EventSourceManager'

const log = new Logger('createHotHandler')

type OrbitHotProps = {
  name: string
  __webpack_require__: { h(): string; id: string }
  module: any
  actions?: any
  reload?: boolean
  warn?: boolean
  log?: boolean
}

// singleton
export const OrbitHot = {
  // for wrapping app entry points
  appHandler: null,
  source: null,
  hotHandlers: new Set<HotHandler>(),
  getCurrentHandler() {
    return this.appHandler
  },
  fileLeave() {
    this.appHandler = null
  },
  fileEnter(props: OrbitHotProps) {
    this.appHandler = entry => {
      const hotEntry = entry
      return hotEntry
    }
    // accept this (this should be created only at root)
    props.module.hot.accept()
    // singleton
    this.source = this.source || new EventSourceManager('/__webpack_hmr')
    let handler = [...OrbitHot.hotHandlers].find(x => x.props.name === props.name)
    if (!handler) {
      handler = new HotHandler(this.source, props)
      OrbitHot.hotHandlers.add(handler)
    }
    return handler
  },
  getHotHandlers() {
    return OrbitHot.hotHandlers
  },
  removeHotHandler(name: string) {
    log.verbose(`removeHotHandler ${name}`)
    OrbitHot.hotHandlers.forEach(handler => {
      if (handler.props.name === name) {
        handler.dispose()
        OrbitHot.hotHandlers.delete(handler)
      }
    })
  },
  removeAllHotHandlers() {
    log.verbose(`removeAllHotHandlers`)
    OrbitHot.hotHandlers.clear()
    this.source.close()
  },
}

class HotHandler {
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

  constructor(private source: EventSourceManager, public props: OrbitHotProps) {
    if (!this.module.hot) {
      throw new Error('[HMR] Hot Module Replacement is disabled.')
    }
    this.source.addMessageListener(this.handleMessage)
    window.addEventListener('beforeunload', this.dispose)
  }

  get module() {
    return this.props.module
  }

  get entry() {
    return this.props.__webpack_require__.id
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
    } catch (error) {
      console.error('[HMR] error', error.message, error.stack, event.data)
    }
  }

  private processMessage({ action, name, hash, modules, errors, warnings, time }) {
    if (name !== this.props.name) {
      return
    }
    const logName = name ? `'${name}' ` : ''
    switch (action) {
      case 'building':
        // console.log('[HMR] bundle ' + logName + 'rebuilding')
        break
      case 'built':
        console.log(`[HMR] rebuilt ${logName}in ${time}ms`)
      // fall through
      case 'sync':
        var applyUpdate = true
        if (errors.length > 0) {
          // if (reporter) reporter.problems('errors', obj)
          applyUpdate = false
        } else if (warnings.length > 0) {
          // console.warn(warnings)
        } else {
          // if (reporter) {
          //   reporter.cleanProblemsCache()
          //   reporter.success()
          // }
        }
        if (applyUpdate) {
          if (!this.upToDate(hash) && this.module.hot.status() == 'idle') {
            if (this.props.log) console.log('[HMR] Checking for updates on the server...')
            this.syncNewUpdate(modules)
          }
        }
        break
    }
  }

  private getHash() {
    return this.props.__webpack_require__.h()
  }

  private upToDate(hash?: string) {
    if (hash) {
      this.lastHash = hash
    }
    return this.lastHash == this.getHash()
  }

  /**
   * The main logic for updating javascript via HMR
   */
  private async syncNewUpdate(moduleMap) {
    try {
      // first check
      const updatedModules = await this.module.hot.check(false)
      if (!updatedModules) {
        if (this.props.warn) console.warn('[HMR] Cannot find update, full reload needed')
        this.performReload()
        return null
      }
      // then apply
      const renewedModules = await this.module.hot.apply(this.applyOptions)
      if (!this.upToDate()) {
        this.syncNewUpdate(moduleMap)
      } else {
        this.logUpdates(moduleMap, updatedModules, renewedModules)
      }
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

// for debugging
if (typeof window !== 'undefined') {
  window['OrbitHot'] = OrbitHot
}
