const stringify = require('stringify-object')
const Mobx = require('mobx')

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

function nodeStringify(_thing) {
  let thing
  try {
    thing = Mobx.toJS(_thing)
  } catch (err) {
    thing = _thing
  }
  if (!thing) {
    return `${thing}`
  }
  if (Array.isArray(thing)) {
    return `[${thing.map(nodeStringify).join(',')}]`
  }
  if (thing instanceof Object) {
    return stringify(thing, {
      indent: '  ',
      inlineCharacterLimit: 50,
      singleQuotes: false,
    })
  }
  if (thing.toString) {
    return thing.toString()
  }
  return `${thing}`
}

const isBrowser = typeof window !== 'undefined'

function colorfulLog(id, namespace, messages) {
  if (!isBrowser) {
    console.log(`${namespace} ${messages.map(nodeStringify).join(' ')}`)
  } else {
    console.log(`${namespace}`, ...messages)
  }
}

module.exports = debug
