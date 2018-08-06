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

export default function debug(namespace) {
  // const uid = id++
  namespaces.push(namespace)
  function log(...messages) {
    if (disableLogs[namespace]) {
      return
    }
    colorfulLog(namespace, messages)
  }
  return log
}

const disableLogging = (list, val) => {
  // @ts-ignore
  const names = list.length ? list : debug.list()
  for (const name of names) {
    disableLogs[name] = val
  }
}

// @ts-ignore
debug.quiet = (...args) => disableLogging(args, true)
// @ts-ignore
debug.loud = (...args) => disableLogging(args, false)
// @ts-ignore
debug.list = () => namespaces
// @ts-ignore
debug.settings = () => disableLogs

function colorfulLog(namespace, messages) {
  console.log(`${namespace}`, ...messages)
}
