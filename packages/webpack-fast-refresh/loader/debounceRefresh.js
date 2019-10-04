const runtime = require('react-refresh/runtime')

// this avoids a refresh on initial render
let hasLoaded = false

function debounceRefresh() {
  if (!hasLoaded) return
  let refreshTimeout = undefined

  function _refresh() {
    if (refreshTimeout === undefined) {
      refreshTimeout = setTimeout(() => {
        refreshTimeout = undefined
        runtime.performReactRefresh()
      }, 30)
    }
  }

  return _refresh()
}

setTimeout(() => {
  hasLoaded = true
}, 0)

module.exports = debounceRefresh
