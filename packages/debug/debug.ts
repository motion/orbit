// let id = 0
const namespaces = []
const disableLogs = {}

interface Debug {
  (ns: string): (...msg: Array<any>) => void
  quiet: any
  loud: any
  list: any
  settings: any
}

const debug = <Debug>function(namespace) {
  // const uid = id++
  namespaces.push(namespace)
  function log(...messages) {
    if (disableLogs[namespace]) return
    colorfulLog(namespace, messages)
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

function colorfulLog(namespace, messages) {
  console.log(`${namespace}`, ...messages)
}

export default debug
