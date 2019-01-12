// adapted FROM: https://github.com/facebook/react/blob/3019210df2b486416ed94d7b9becffaf254e81c4/src/renderers/shared/ReactDOMFrameScheduling.js

'use strict'

// This is a built-in polyfill for requestIdleCallback. It works by scheduling
// a requestAnimationFrame, storing the time for the start of the frame, then
// scheduling a postMessage which gets scheduled after paint. Within the
// postMessage handler do as much work as possible until time + frame rate.
// By separating the idle call into a separate event tick we ensure that
// layout, paint and other browser work is counted against the available time.
// The frame rate is dynamically adjusted.

const hasNativePerformanceNow =
  typeof performance === 'object' && typeof performance.now === 'function'

let now
if (hasNativePerformanceNow) {
  now = function() {
    return performance.now()
  }
} else {
  now = function() {
    return Date.now()
  }
}

// TODO: There's no way to cancel, because Fiber doesn't atm.
let rIC = function(frameCallback) {
  setTimeout(() => {
    frameCallback({
      timeRemaining() {
        return Infinity
      },
    })
  })
  return 0
}

exports.now = now
exports.rIC = rIC
