function createEventSource(url: string) {
  var source
  var listeners = []

  init()

  function init() {
    source = new EventSource(url)
    source.onopen = handleOnline
    source.onerror = handleDisconnect
    source.onmessage = handleMessage
  }

  function handleOnline() {
    console.log('[HMR] connected')
  }

  function handleMessage(event) {
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event)
    }
  }

  function handleDisconnect() {
    source.close()
    setTimeout(init, 1000)
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn)
    },
  }
}

export function hmrSocket(url: string) {
  createEventSource(url).addMessageListener(handleMessage)

  function handleMessage(event) {
    if (event.data == '\uD83D\uDC93') {
      return
    }
    try {
      processMessage(JSON.parse(event.data))
    } catch (ex) {
      console.warn('Invalid HMR message: ' + event.data + '\n' + ex)
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
// var singletonKey = '__webpack_hot_middleware_reporter__'
// var reporter
// if (typeof window !== 'undefined') {
//   if (!window[singletonKey]) {
//     window[singletonKey] = createReporter()
//   }
//   reporter = window[singletonKey]
// }

// function createReporter() {
//   var strip = require('strip-ansi')

//   var overlay
//   if (typeof document !== 'undefined' && options.overlay) {
//     overlay = require('./client-overlay')({
//       ansiColors: options.ansiColors,
//       overlayStyles: options.overlayStyles,
//     })
//   }

//   var styles = {
//     errors: 'color: #ff0000;',
//     warnings: 'color: #999933;',
//   }
//   var previousProblems = null
//   function log(type, obj) {
//     var newProblems = obj[type]
//       .map(function(msg) {
//         return strip(msg)
//       })
//       .join('\n')
//     if (previousProblems == newProblems) {
//       return
//     } else {
//       previousProblems = newProblems
//     }

//     var style = styles[type]
//     var name = obj.name ? "'" + obj.name + "' " : ''
//     var title = '[HMR] bundle ' + name + 'has ' + obj[type].length + ' ' + type
//     // NOTE: console.warn or console.error will print the stack trace
//     // which isn't helpful here, so using console.log to escape it.
//     if (console.group && console.groupEnd) {
//       console.group('%c' + title, style)
//       console.log('%c' + newProblems, style)
//       console.groupEnd()
//     } else {
//       console.log(
//         '%c' + title + '\n\t%c' + newProblems.replace(/\n/g, '\n\t'),
//         style + 'font-weight: bold;',
//         style + 'font-weight: normal;',
//       )
//     }
//   }

//   return {
//     cleanProblemsCache: function() {
//       previousProblems = null
//     },
//     problems: function(type, obj) {
//       if (options.warn) {
//         log(type, obj)
//       }
//       if (overlay) {
//         if (options.overlayWarnings || type === 'errors') {
//           overlay.showProblems(type, obj[type])
//           return false
//         }
//         overlay.clear()
//       }
//       return true
//     },
//     success: function() {
//       if (overlay) overlay.clear()
//     },
//     useCustomOverlay: function(customOverlay) {
//       overlay = customOverlay
//     },
//   }
// }

// var processUpdate = require('./process-update')

var customHandler
var subscribeAllHandler
function processMessage(obj) {
  switch (obj.action) {
    case 'building':
      console.log('[HMR] bundle ' + (obj.name ? "'" + obj.name + "' " : '') + 'rebuilding')
      break
    case 'built':
      console.log(
        '[HMR] bundle ' + (obj.name ? "'" + obj.name + "' " : '') + 'rebuilt in ' + obj.time + 'ms',
      )
    // fall through
    case 'sync':
      var applyUpdate = true
      if (obj.errors.length > 0) {
        // if (reporter) reporter.problems('errors', obj)
        applyUpdate = false
      } else if (obj.warnings.length > 0) {
        // if (reporter) {
        //   var overlayShown = reporter.problems('warnings', obj)
        //   applyUpdate = overlayShown
        // }
      } else {
        // if (reporter) {
        //   reporter.cleanProblemsCache()
        //   reporter.success()
        // }
      }
      if (applyUpdate) {
        // processUpdate(obj.hash, obj.modules, options)
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
