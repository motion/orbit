let id = 0
const namespaces = []
const disableLogs = {}

function debug(namespace) {
  const uid = id++
  namespaces.push(namespace)
  return function log(...messages) {
    if (disableLogs[namespace]) {
      return
    }
    colorfulLog(uid, namespace, messages)
  }
}

debug.quiet = () => debug.disable(...debug.list())
debug.loud = () => debug.enable(...debug.list())
debug.list = () => namespaces
debug.enable = (...logNames) => {
  for (const name of logNames) {
    disableLogs[name] = false
  }
}
debug.disable = (...logNames) => {
  for (const name of logNames) {
    disableLogs[name] = true
  }
}
debug.settings = () => disableLogs

function colorfulLog(id, namespace, messages) {
  console.log(`${namespace}`, ...messages)
}

module.exports = debug
