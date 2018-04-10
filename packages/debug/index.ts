let id = 0
const namespaces = []
const disableLogs = {}

function debug(namespace) {
  const uid = id++
  namespaces.push(namespace)
  function log(...messages) {
    if (disableLogs[namespace]) return
    colorfulLog(uid, namespace, messages)
  }
  return log
}

const setLogging = (list, val) => {
  const names = list.length ? list : debug.list()
  for (const name of names) {
    disableLogs[name] = val
  }
}

debug.quiet = (...args) => setLogging(args, true)
debug.loud = (...args) => setLogging(args, false)
debug.list = () => namespaces
debug.settings = () => disableLogs

function colorfulLog(id, namespace, messages) {
  console.log(`${namespace}`, ...messages)
}

module.exports = debug
module.exports.default = debug
