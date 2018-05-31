// let id = 0
const namespaces = []
const disableLogs = {}

export interface Debug {
  (ns: string): (...msg: Array<any>) => void
  quiet: any
  loud: any
  list: any
  settings: any
}

const dbg = <Debug>function(namespace) {
  // const uid = id++
  namespaces.push(namespace)
  function log(...messages) {
    if (disableLogs[namespace]) return
    colorfulLog(namespace, messages)
  }
  return log
}

const setLogging = (list, val) => {
  const names = list.length ? list : dbg.list()
  for (const name of names) {
    disableLogs[name] = val
  }
}

dbg.quiet = (...args) => setLogging(args, true)
dbg.loud = (...args) => setLogging(args, false)
dbg.list = () => namespaces
dbg.settings = () => disableLogs

function colorfulLog(namespace, messages) {
  console.log(`${namespace}`, ...messages)
}

export default dbg
