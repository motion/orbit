// Based on https://github.com/petehunt/react-raf-batching
// but also triggers `tick` regularly if tab is inactive.

const ReactUpdates = require('react-dom/lib/ReactUpdates')
const FORCE_TICK_INTERVAL = 1000
const flush = ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)

let timeout

function tick() {
  flush()
  requestAnimationFrame(tick)
  clearTimeout(timeout)
  // Do not call `tick()`, that could cause multiple RAF cycles and hog CPU.
  timeout = setTimeout(forceTick, FORCE_TICK_INTERVAL)
}

function forceTick() {
  flush()
  timeout = setTimeout(forceTick, FORCE_TICK_INTERVAL)
}

const ReactRAFBatchingStrategy = {
  isBatchingUpdates: true,

  /**
   * Call the provided function in a context within which calls to `setState`
   * and friends are batched such that components aren't updated unnecessarily.
   */
  batchedUpdates: function(callback) {
    // Do we have to do this anymore?
    const args = new Array(arguments.length - 1)
    for (let i = 0; i < args.length; ++i) {
      args[i] = arguments[i + 1]
    }
    callback.apply(null, args)
  },

  inject: function() {
    console.log('batching updates')
    ReactUpdates.injection.injectBatchingStrategy(ReactRAFBatchingStrategy)
    tick()
  }
}

ReactRAFBatchingStrategy.inject()
