let activeHandlers = []

async function stopSockets() {
  for (const { source } of activeHandlers) {
    source.close()
  }
  await new Promise(res => setTimeout(res, 20))
}

async function restartSockets() {
  activeHandlers = []
  Object.keys(window['__hmr_handlers']).forEach(key => {
    window['__hmr_handlers'][key]()
  })
}

export function createHotHandler(props: {
  url: string
  getHash: Function
  module: any
  actions?: any
}) {
  const { url, getHash, module, actions = {} } = props

  if (!module.hot) {
    console.warn('hot not active')
    return
  }

  const source = createEventSource(url)
  source.addMessageListener(handleMessage)

  activeHandlers.push({ ...props, source })

  window.addEventListener('beforeunload', source.close)
  module.hot.dispose(() => {
    source.close()
  })

  function handleMessage(event) {
    if (event.data == '\uD83D\uDC93') {
      return
    }
    try {
      const msg = JSON.parse(event.data)
      processMessage(msg)
      if (actions[msg.action]) {
        actions[msg.action](msg)
      }
    } catch (ex) {
      console.warn('Invalid HMR message: ' + event.data + '\n' + ex)
    }
  }

  function createEventSource(url: string) {
    var source
    var listeners: any[] = []

    init()

    function init() {
      source = new EventSource(url)
      source.onopen = handleOnline
      source.onerror = handleDisconnect
      source.onmessage = handleMessage
    }

    function handleOnline() {
      console.debug('[HMR] connected')
    }

    function handleMessage(event) {
      for (var i = 0; i < listeners.length; i++) {
        listeners[i](event)
      }
    }

    function handleDisconnect() {
      console.log('[HMR] disconnected')
      source.close()
      setTimeout(init, 1000)
    }

    return {
      addMessageListener: function(fn) {
        listeners.push(fn)
      },
      close: () => {
        source.close()
      },
    }
  }

  var customHandler
  var subscribeAllHandler
  function processMessage(obj) {
    switch (obj.action) {
      case 'building':
        // console.log('[HMR] bundle ' + (obj.name ? "'" + obj.name + "' " : '') + 'rebuilding')
        break
      case 'built':
        console.log(
          '[HMR] bundle ' +
            (obj.name ? "'" + obj.name + "' " : '') +
            'rebuilt in ' +
            obj.time +
            'ms',
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
          processUpdate(obj.hash, obj.modules, { reload: true })
        }
        break
      default:
        if (customHandler) {
          customHandler(obj)
        }
    }

    if (subscribeAllHandler) {
      subscribeAllHandler(obj)
    }
  }

  /**
   * Based heavily on https://github.com/webpack/webpack/blob/
   *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
   * Original copyright Tobias Koppers @sokra (MIT license)
   */

  if (!module.hot) {
    throw new Error('[HMR] Hot Module Replacement is disabled.')
  } else {
    // accept this we are at root
    module.hot.accept()
  }

  var hmrDocsUrl = 'https://webpack.js.org/concepts/hot-module-replacement/' // eslint-disable-line max-len

  var lastHash
  var failureStatuses = { abort: 1, fail: 1 }
  var applyOptions = {
    ignoreUnaccepted: true,
    ignoreDeclined: true,
    ignoreErrored: true,
    onUnaccepted: function(data) {
      console.warn('Ignored an update to unaccepted module ' + data.chain.join(' -> '), data.chain)
    },
    onDeclined: function(data) {
      console.warn('Ignored an update to declined module ' + data.chain.join(' -> '), data.chain)
    },
    onErrored: function(data) {
      console.error(data.error)
      console.warn(
        'Ignored an error while updating module ' + data.moduleId + ' (' + data.type + ')',
      )
    },
  }

  function upToDate(hash?) {
    if (hash) lastHash = hash
    return lastHash == getHash()
  }

  async function processUpdate(hash, moduleMap, options) {
    var reload = options.reload
    if (!upToDate(hash) && module.hot.status() == 'idle') {
      if (options.log) console.log('[HMR] Checking for updates on the server...')
      await stopSockets()
      check()
    }

    function check() {
      var cb = function(err, updatedModules) {
        if (err) return handleError(err)

        restartSockets()

        if (!updatedModules) {
          if (options.warn) {
            console.warn('[HMR] Cannot find update (Full reload needed)')
            console.warn('[HMR] (Probably because of restarting the server)')
          }
          performReload()
          return null
        }

        var applyCallback = function(applyErr, renewedModules) {
          if (applyErr) return handleError(applyErr)

          if (!upToDate()) check()

          logUpdates(updatedModules, renewedModules)
        }

        var applyResult = module.hot.apply(applyOptions, applyCallback) as any
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

      var result = module.hot.check(false, cb) as any
      // webpack 2 promise
      if (result && result.then) {
        result.then(function(updatedModules) {
          cb(null, updatedModules)
        })
        result.catch(cb)
      }
    }

    function logUpdates(updatedModules, renewedModules) {
      var unacceptedModules = updatedModules.filter(function(moduleId) {
        return renewedModules && renewedModules.indexOf(moduleId) < 0
      })

      if (unacceptedModules.length > 0) {
        if (options.warn) {
          console.warn(
            "[HMR] The following modules couldn't be hot updated: " +
              '(Full reload needed)\n' +
              'This is usually because the modules which have changed ' +
              '(and their parents) do not know how to hot reload themselves. ' +
              'See ' +
              hmrDocsUrl +
              ' for more details.',
          )
          unacceptedModules.forEach(function(moduleId) {
            console.warn('[HMR]  - ' + (moduleMap[moduleId] || moduleId))
          })
        }
        performReload()
        return
      }

      if (options.log) {
        if (!renewedModules || renewedModules.length === 0) {
          console.log('[HMR] Nothing hot updated.')
        } else {
          console.log('[HMR] Updated modules:')
          renewedModules.forEach(function(moduleId) {
            console.log('[HMR]  - ' + (moduleMap[moduleId] || moduleId))
          })
        }

        if (upToDate()) {
          console.log('[HMR] App is up to date.')
        }
      }
    }

    function handleError(err) {
      if (module.hot.status() in failureStatuses) {
        if (options.warn) {
          console.warn('[HMR] Cannot check for update (Full reload needed)')
          console.warn('[HMR] ' + (err.stack || err.message))
        }
        performReload()
        return
      }
      if (options.warn) {
        console.warn('[HMR] Update check failed: ' + (err.stack || err.message))
      }
    }

    function performReload() {
      if (reload) {
        if (options.warn) console.warn('[HMR] Reloading page')
        // window.location.reload()
      }
    }
  }
}
